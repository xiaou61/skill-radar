const CATEGORY_RULES = [
  {
    key: "ai-agents",
    label: "AI / Agents / MCP",
    keywords: [
      "agent",
      "agents",
      "mcp",
      "llm",
      "model",
      "prompt",
      "codex",
      "claude",
      "openai",
      "context",
      "skill",
      "harness",
      "evaluation"
    ]
  },
  {
    key: "frontend-design",
    label: "Frontend / Design / Visual",
    keywords: [
      "frontend",
      "design",
      "ui",
      "ux",
      "html",
      "css",
      "react",
      "vue",
      "dashboard",
      "landing page",
      "diagram",
      "draw.io",
      "wireframe",
      "theme",
      "slide",
      "animation",
      "visual",
      "canvas"
    ]
  },
  {
    key: "backend-platform",
    label: "Backend / API / Platform",
    keywords: [
      "backend",
      "api",
      "server",
      "service",
      "database",
      "rest",
      "express",
      "next.js api",
      "node.js",
      "platform",
      "architecture"
    ]
  },
  {
    key: "java-spring",
    label: "Java / Spring",
    keywords: [
      "spring",
      "spring boot",
      "springboot",
      "mockmvc",
      "junit",
      "java",
      "testcontainers"
    ]
  },
  {
    key: "testing-quality",
    label: "Testing / QA / Verification",
    keywords: [
      "test",
      "testing",
      "qa",
      "verify",
      "verification",
      "regression",
      "coverage",
      "playwright",
      "e2e",
      "tdd",
      "bug",
      "lighthouse",
      "review"
    ]
  },
  {
    key: "security",
    label: "Security",
    keywords: [
      "security",
      "auth",
      "authentication",
      "authorization",
      "csrf",
      "secret",
      "secrets",
      "vulnerability",
      "cve",
      "rate limiting"
    ]
  },
  {
    key: "docs-office-research",
    label: "Docs / Office / Research",
    keywords: [
      "document",
      "doc",
      "docx",
      "pdf",
      "ppt",
      "pptx",
      "xlsx",
      "spreadsheet",
      "excel",
      "thesis",
      "paper",
      "write",
      "writing",
      "research",
      "report"
    ]
  },
  {
    key: "business-content",
    label: "Business / Content / Communication",
    keywords: [
      "investor",
      "outreach",
      "newsletter",
      "content",
      "social",
      "communication",
      "internal comms",
      "marketing",
      "brand",
      "pitch",
      "fundraising",
      "market research",
      "article"
    ]
  },
  {
    key: "workflow-utilities",
    label: "Workflow / Utilities",
    keywords: [
      "workflow",
      "plan",
      "planning",
      "windows",
      "utility",
      "toolkit",
      "screenshot",
      "upload",
      "compact",
      "guideline",
      "helper"
    ]
  }
];

const EXACT_CATEGORY_MAP = new Map([
  ["drawio", "frontend-design"],
  ["canvas-design", "frontend-design"],
  ["frontend-design", "frontend-design"],
  ["ui-ux-pro-max", "frontend-design"],
  ["theme-factory", "frontend-design"],
  ["html-ppt", "frontend-design"],
  ["frontend-slides", "frontend-design"],
  ["backend-patterns", "backend-platform"],
  ["api-design", "backend-platform"],
  ["security-review", "security"],
  ["springboot-security", "security"],
  ["springboot-patterns", "java-spring"],
  ["springboot-tdd", "java-spring"],
  ["springboot-verification", "java-spring"],
  ["doc", "docs-office-research"],
  ["docx", "docs-office-research"],
  ["pdf", "docs-office-research"],
  ["pptx", "docs-office-research"],
  ["xlsx", "docs-office-research"],
  ["thesis-docx", "docs-office-research"],
  ["thesis-standardizer", "docs-office-research"],
  ["market-research", "business-content"],
  ["article-writing", "business-content"],
  ["investor-materials", "business-content"],
  ["investor-outreach", "business-content"],
  ["content-engine", "business-content"],
  ["internal-comms", "business-content"],
  ["brand-guidelines", "business-content"],
  ["playwright", "testing-quality"],
  ["browser-qa", "testing-quality"],
  ["webapp-testing", "testing-quality"],
  ["e2e-testing", "testing-quality"],
  ["tdd-workflow", "testing-quality"],
  ["verification-loop", "testing-quality"],
  ["ai-regression-testing", "testing-quality"],
  ["mcp-builder", "ai-agents"],
  ["mcp-server-patterns", "ai-agents"],
  ["agentic-engineering", "ai-agents"],
  ["agent-harness-construction", "ai-agents"],
  ["eval-harness", "ai-agents"],
  ["documentation-lookup", "ai-agents"],
  ["openai-docs", "ai-agents"],
  ["plugin-creator", "ai-agents"],
  ["skill-creator", "ai-agents"],
  ["skill-installer", "ai-agents"],
  ["pua", "workflow-utilities"],
  ["planning-with-files", "workflow-utilities"],
  ["strategic-compact", "workflow-utilities"],
  ["windows-large-file-writes", "workflow-utilities"],
  ["screenshot", "workflow-utilities"]
]);

function getCategoryLabel(categoryKey) {
  const rule = CATEGORY_RULES.find((item) => item.key === categoryKey);
  return rule ? rule.label : "Workflow / Utilities";
}

function classifySkill(skill) {
  const normalizedName = (skill.name || "").toLowerCase();

  if (EXACT_CATEGORY_MAP.has(normalizedName)) {
    const key = EXACT_CATEGORY_MAP.get(normalizedName);
    return { key, label: getCategoryLabel(key), reason: "exact-name" };
  }

  const haystack = [
    skill.name,
    skill.description,
    skill.relativePath,
    skill.frontmatter.origin
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let bestRule = CATEGORY_RULES[CATEGORY_RULES.length - 1];
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;

    for (const keyword of rule.keywords) {
      if (haystack.includes(keyword)) {
        score += keyword.includes(" ") ? 3 : 2;
      }
    }

    if (normalizedName.includes(rule.key)) {
      score += 4;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return {
    key: bestRule.key,
    label: bestRule.label,
    reason: bestScore > 0 ? "keyword-match" : "fallback"
  };
}

module.exports = {
  CATEGORY_RULES,
  classifySkill,
  getCategoryLabel
};
