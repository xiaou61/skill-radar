const fs = require("node:fs/promises");
const path = require("node:path");

const { scanSkills } = require("./scanner");
const { renderMarkdown } = require("./reportRenderer");

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const report = await scanSkills({
    includeAgents: options.includeAgents,
    customSources: options.customSources
  });

  await fs.mkdir(options.outputDir, { recursive: true });

  const jsonPath = path.join(options.outputDir, "skills-summary.json");
  const markdownPath = path.join(options.outputDir, "skills-summary.md");

  if (options.format === "json" || options.format === "both") {
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");
  }

  if (options.format === "md" || options.format === "both") {
    await fs.writeFile(markdownPath, renderMarkdown(report), "utf8");
  }

  printResult(report, options, { jsonPath, markdownPath });
}

function parseArgs(args) {
  const options = {
    outputDir: path.resolve(process.cwd(), "reports"),
    format: "both",
    includeAgents: true,
    customSources: [],
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (current === "--help" || current === "-h") {
      options.help = true;
      continue;
    }

    if (current === "--output-dir") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--output-dir 需要一个路径参数。");
      }
      options.outputDir = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }

    if (current === "--format") {
      const value = args[index + 1];
      if (!value || !["md", "json", "both"].includes(value)) {
        throw new Error("--format 只支持 md、json、both。");
      }
      options.format = value;
      index += 1;
      continue;
    }

    if (current === "--skip-agents") {
      options.includeAgents = false;
      continue;
    }

    if (current === "--source") {
      const value = args[index + 1];
      if (!value || !value.includes("=")) {
        throw new Error("--source 需要 name=path 这样的参数。");
      }

      const separatorIndex = value.indexOf("=");
      const id = value.slice(0, separatorIndex).trim();
      const rootPath = value.slice(separatorIndex + 1).trim();

      if (!id || !rootPath) {
        throw new Error("--source 的 name 和 path 都不能为空。");
      }

      options.customSources.push({
        id,
        label: id,
        kind: "custom",
        rootPath: path.resolve(process.cwd(), rootPath)
      });

      index += 1;
      continue;
    }

    throw new Error(`不支持的参数: ${current}`);
  }

  return options;
}

function printHelp() {
  console.log(`用法:
  npm run scan
  npm run scan -- --skip-agents
  npm run scan -- --source myskills=D:\\skills --output-dir dist

参数:
  --format md|json|both    输出格式，默认 both
  --output-dir <dir>       输出目录，默认 reports
  --skip-agents            跳过 ~/.agents/skills
  --source name=path       追加自定义技能根目录
  --help                   显示帮助
`);
}

function printResult(report, options, outputPaths) {
  console.log(`扫描完成，共发现 ${report.summary.totals.skillsDetected} 个技能。`);

  for (const source of report.summary.sourceStates) {
    console.log(`- ${source.label}: ${source.exists ? source.skillCount : "目录不存在"}`);
  }

  if (options.format === "json" || options.format === "both") {
    console.log(`JSON 报告: ${outputPaths.jsonPath}`);
  }

  if (options.format === "md" || options.format === "both") {
    console.log(`Markdown 报告: ${outputPaths.markdownPath}`);
  }
}

main().catch((error) => {
  console.error(`扫描失败: ${error.message}`);
  process.exitCode = 1;
});
