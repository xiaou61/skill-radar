const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const { CATEGORY_RULES, classifySkill } = require("./categoryRules");
const { attachReportTranslations } = require("./translations");

const SOURCE_DEFINITIONS = [
  {
    id: "codex",
    label: "Codex",
    kind: "primary",
    rootPath: path.join(os.homedir(), ".codex", "skills")
  },
  {
    id: "claude",
    label: "Claude Code",
    kind: "primary",
    rootPath: path.join(os.homedir(), ".claude", "skills")
  },
  {
    id: "agents",
    label: "Agents / Legacy",
    kind: "secondary",
    rootPath: path.join(os.homedir(), ".agents", "skills")
  }
];

async function scanSkills(options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const sources = buildSources(normalizedOptions);
  const scannedSources = [];
  const allSkills = [];

  for (const source of sources) {
    const exists = await pathExists(source.rootPath);
    const skillDirs = exists ? await findSkillDirectories(source.rootPath) : [];
    const skills = [];

    for (const skillDir of skillDirs) {
      const skill = await readSkill(source, skillDir);
      skills.push(skill);
      allSkills.push(skill);
    }

    skills.sort((left, right) => left.name.localeCompare(right.name));

    scannedSources.push({
      ...source,
      exists,
      skillCount: skills.length,
      skills
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    machine: {
      platform: process.platform,
      homeDirectory: os.homedir()
    },
    sources: scannedSources,
    summary: buildSummary(scannedSources, allSkills),
    skills: allSkills
  };

  return attachReportTranslations(report);
}

function normalizeOptions(options) {
  return {
    includeAgents: options.includeAgents !== false,
    customSources: Array.isArray(options.customSources) ? options.customSources : []
  };
}

function buildSources(options) {
  const defaults = SOURCE_DEFINITIONS.filter((source) => {
    if (source.id === "agents" && !options.includeAgents) {
      return false;
    }
    return true;
  });

  return [
    ...defaults,
    ...options.customSources.map((source) => ({
      id: source.id,
      label: source.label || source.id,
      kind: source.kind || "custom",
      rootPath: path.resolve(source.rootPath)
    }))
  ];
}

async function findSkillDirectories(rootPath) {
  const results = [];
  const visited = new Set();

  async function walk(directoryPath) {
    let realDirectoryPath;

    try {
      realDirectoryPath = await fs.realpath(directoryPath);
    } catch {
      realDirectoryPath = directoryPath;
    }

    if (visited.has(realDirectoryPath)) {
      return;
    }
    visited.add(realDirectoryPath);

    const skillFilePath = path.join(directoryPath, "SKILL.md");
    if (await pathExists(skillFilePath)) {
      results.push(directoryPath);
      return;
    }

    let entries = [];
    try {
      entries = await fs.readdir(directoryPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!(entry.isDirectory() || entry.isSymbolicLink())) {
        continue;
      }

      const nextPath = path.join(directoryPath, entry.name);
      if (await isDirectoryLike(nextPath)) {
        await walk(nextPath);
      }
    }
  }

  await walk(rootPath);
  results.sort((left, right) => left.localeCompare(right));
  return results;
}

async function readSkill(source, skillDir) {
  const skillMdPath = path.join(skillDir, "SKILL.md");
  const content = await fs.readFile(skillMdPath, "utf8");
  const parsed = parseFrontmatter(content);
  const relativePath = normalizePath(path.relative(source.rootPath, skillDir));
  const name = parsed.frontmatter.name || path.basename(skillDir);
  const description = parsed.frontmatter.description || deriveDescription(parsed.body);
  const stats = await inspectSkillDirectory(skillDir);
  const category = classifySkill({
    name,
    description,
    relativePath,
    frontmatter: parsed.frontmatter
  });

  return {
    name,
    description,
    sourceId: source.id,
    sourceLabel: source.label,
    sourceKind: source.kind,
    rootPath: source.rootPath,
    skillDir,
    skillMdPath,
    relativePath,
    visibility: relativePath.startsWith(".system/") ? "system" : "normal",
    frontmatter: parsed.frontmatter,
    category,
    stats
  };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return {
      frontmatter: {},
      body: content.trim()
    };
  }

  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontmatter[key] = stripWrappingQuotes(value);
  }

  return {
    frontmatter,
    body: content.slice(match[0].length).trim()
  };
}

function deriveDescription(body) {
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"));

  const firstParagraph = lines[0] || "";
  return firstParagraph.replace(/\s+/g, " ").slice(0, 240);
}

async function inspectSkillDirectory(skillDir) {
  const entries = await fs.readdir(skillDir, { withFileTypes: true });
  const directoryNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  return {
    directoryCount: directoryNames.length,
    fileCount: fileNames.length,
    hasScripts: directoryNames.includes("scripts"),
    hasAgents: directoryNames.includes("agents"),
    hasReferences: directoryNames.includes("references"),
    hasAssets: directoryNames.includes("assets"),
    hasTemplates: directoryNames.includes("templates"),
    hasThemes: directoryNames.includes("themes")
  };
}

function buildSummary(sources, skills) {
  const codexSource = sources.find((source) => source.id === "codex");
  const claudeSource = sources.find((source) => source.id === "claude");

  const codexNames = new Set((codexSource?.skills || []).map((skill) => skill.name));
  const claudeNames = new Set((claudeSource?.skills || []).map((skill) => skill.name));

  const sharedBetweenCodexAndClaude = [...codexNames].filter((name) => claudeNames.has(name)).sort();
  const codexOnly = [...codexNames].filter((name) => !claudeNames.has(name)).sort();
  const claudeOnly = [...claudeNames].filter((name) => !codexNames.has(name)).sort();

  const skillsByCategory = new Map();
  for (const rule of CATEGORY_RULES) {
    skillsByCategory.set(rule.key, {
      key: rule.key,
      label: rule.label,
      total: 0,
      bySource: {}
    });
  }

  for (const skill of skills) {
    const bucket = skillsByCategory.get(skill.category.key);
    if (!bucket) {
      continue;
    }
    bucket.total += 1;
    bucket.bySource[skill.sourceId] = (bucket.bySource[skill.sourceId] || 0) + 1;
  }

  const duplicateSkills = [];
  const skillsByName = new Map();

  for (const skill of skills) {
    const group = skillsByName.get(skill.name) || [];
    group.push(skill);
    skillsByName.set(skill.name, group);
  }

  for (const [name, group] of skillsByName.entries()) {
    const uniqueSources = [...new Set(group.map((item) => item.sourceId))];
    if (uniqueSources.length > 1) {
      duplicateSkills.push({ name, sources: uniqueSources.sort() });
    }
  }

  duplicateSkills.sort((left, right) => left.name.localeCompare(right.name));

  return {
    totals: {
      sourcesDetected: sources.filter((source) => source.exists).length,
      skillsDetected: skills.length,
      systemSkills: skills.filter((skill) => skill.visibility === "system").length
    },
    sourceStates: sources.map((source) => ({
      id: source.id,
      label: source.label,
      kind: source.kind,
      exists: source.exists,
      rootPath: source.rootPath,
      skillCount: source.skillCount
    })),
    categorySummary: [...skillsByCategory.values()].sort((left, right) => {
      if (right.total !== left.total) {
        return right.total - left.total;
      }
      return left.label.localeCompare(right.label);
    }),
    comparisons: {
      codexVsClaude: {
        shared: sharedBetweenCodexAndClaude,
        codexOnly,
        claudeOnly
      },
      duplicatesAcrossSources: duplicateSkills
    }
  };
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function isDirectoryLike(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function normalizePath(targetPath) {
  return targetPath.split(path.sep).join("/");
}

module.exports = {
  SOURCE_DEFINITIONS,
  scanSkills,
  buildSources
};
