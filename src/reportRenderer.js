function renderMarkdown(report) {
  const lines = [];
  const primarySourceIds = ["codex", "claude"];
  const primarySources = report.sources.filter((source) => primarySourceIds.includes(source.id));
  const extraSources = report.sources.filter((source) => !primarySourceIds.includes(source.id));
  const comparison = report.summary.comparisons.codexVsClaude;

  lines.push("# 本地 Skills 汇总");
  lines.push("");
  lines.push(`生成时间：${report.generatedAt}`);
  lines.push("");
  lines.push("## 总览");
  lines.push("");
  lines.push(`- 已检测到技能总数：${report.summary.totals.skillsDetected}`);
  lines.push(`- 已检测到技能源：${report.summary.totals.sourcesDetected}`);
  lines.push(`- 系统技能数：${report.summary.totals.systemSkills}`);
  lines.push("");
  lines.push("## 技能源状态");
  lines.push("");
  lines.push("| 来源 | 类型 | 路径 | 是否存在 | 技能数 |");
  lines.push("| --- | --- | --- | --- | ---: |");

  for (const source of report.summary.sourceStates) {
    lines.push(
      `| ${source.labelZh || source.label} | ${source.kind} | \`${source.rootPath}\` | ${source.exists ? "是" : "否"} | ${source.skillCount} |`
    );
  }

  lines.push("");
  lines.push("## Codex / Claude Code 对比");
  lines.push("");
  lines.push(`- 两边共有：${comparison.shared.length}`);
  lines.push(`- 仅 Codex：${comparison.codexOnly.length}`);
  lines.push(`- 仅 Claude Code：${comparison.claudeOnly.length}`);
  lines.push("");
  lines.push(`### 共有 Skills (${comparison.shared.length})`);
  lines.push("");
  lines.push(renderInlineList(comparison.shared));
  lines.push("");
  lines.push(`### 仅 Codex (${comparison.codexOnly.length})`);
  lines.push("");
  lines.push(renderInlineList(comparison.codexOnly));
  lines.push("");
  lines.push(`### 仅 Claude Code (${comparison.claudeOnly.length})`);
  lines.push("");
  lines.push(renderInlineList(comparison.claudeOnly));
  lines.push("");
  lines.push("## 分类统计");
  lines.push("");

  const sourceColumns = report.summary.sourceStates.map((source) => source.id);
  const sourceLabelMap = Object.fromEntries(
    report.summary.sourceStates.map((source) => [source.id, source.labelZh || source.label])
  );
  const header = ["分类", "总数", ...sourceColumns.map((id) => sourceLabelMap[id])];

  lines.push(`| ${header.join(" | ")} |`);
  lines.push(`| ${header.map((item, index) => (index === 0 ? "---" : "---:")).join(" | ")} |`);

  for (const category of report.summary.categorySummary) {
    const counts = sourceColumns.map((sourceId) => category.bySource[sourceId] || 0);
    lines.push(`| ${category.label} | ${category.total} | ${counts.join(" | ")} |`);
  }

  lines.push("");
  if (extraSources.length > 0) {
    lines.push("## 额外检测到的技能源");
    lines.push("");
    for (const source of extraSources) {
      lines.push(`- ${source.labelZh || source.label}：${source.skillCount} 个技能，路径 \`${source.rootPath}\``);
    }
    lines.push("");
  }

  lines.push("## 详细清单");
  lines.push("");

  const skillsByCategory = new Map();
  for (const skill of report.skills) {
    const bucket = skillsByCategory.get(skill.category.label) || [];
    bucket.push(skill);
    skillsByCategory.set(skill.category.label, bucket);
  }

  for (const category of report.summary.categorySummary) {
    const skills = (skillsByCategory.get(category.label) || []).sort((left, right) => {
      const sourceCompare = left.sourceLabel.localeCompare(right.sourceLabel);
      if (sourceCompare !== 0) {
        return sourceCompare;
      }
      return left.name.localeCompare(right.name);
    });

    if (skills.length === 0) {
      continue;
    }

    lines.push(`### ${category.labelZh || category.label}`);
    lines.push("");

    for (const skill of skills) {
      const tags = [];
      if (skill.visibility === "system") {
        tags.push("system");
      }
      if (skill.stats.hasScripts) {
        tags.push("scripts");
      }
      if (skill.stats.hasAgents) {
        tags.push("agents");
      }
      if (skill.stats.hasReferences) {
        tags.push("references");
      }
      if (skill.stats.hasTemplates) {
        tags.push("templates");
      }
      if (skill.stats.hasThemes) {
        tags.push("themes");
      }

      const tagText = tags.length > 0 ? ` | 标签：${tags.join(", ")}` : "";
      lines.push(
        `- \`${skill.translation?.nameZh || skill.name}\` | 来源：${skill.translation?.sourceLabelZh || skill.sourceLabel} | 相对路径：\`${skill.relativePath}\`${tagText}`
      );
      if (skill.translation?.nameZh && skill.translation.nameZh !== skill.name) {
        lines.push(`  原名：${skill.name}`);
      }
      lines.push(`  说明：${skill.translation?.descriptionZh || skill.description || "未提取到描述。"}`);
    }

    lines.push("");
  }

  if (report.summary.comparisons.duplicatesAcrossSources.length > 0) {
    lines.push("## 重名技能");
    lines.push("");
    for (const item of report.summary.comparisons.duplicatesAcrossSources) {
      lines.push(`- \`${item.name}\`：${item.sources.join(", ")}`);
    }
    lines.push("");
  }

  if (primarySources.some((source) => source.exists && source.skillCount === 0)) {
    lines.push("## 提示");
    lines.push("");
    for (const source of primarySources) {
      if (source.exists && source.skillCount === 0) {
        lines.push(`- ${source.label} 的 skills 目录存在，但当前没有扫描到标准 \`SKILL.md\` 技能。`);
      }
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderInlineList(items) {
  if (items.length === 0) {
    return "_无_";
  }
  return items.map((item) => `\`${item}\``).join("、");
}

module.exports = {
  renderMarkdown
};
