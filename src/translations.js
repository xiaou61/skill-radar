const CATEGORY_LABEL_ZH = {
  "ai-agents": "AI / Agent / MCP",
  "frontend-design": "前端 / 设计 / 可视化",
  "backend-platform": "后端 / API / 平台",
  "java-spring": "Java / Spring",
  "testing-quality": "测试 / 质检 / 验证",
  security: "安全",
  "docs-office-research": "文档 / 办公 / 研究",
  "business-content": "业务 / 内容 / 沟通",
  "workflow-utilities": "流程 / 工具"
};

const SOURCE_LABEL_ZH = {
  codex: "Codex",
  claude: "Claude Code",
  agents: "Agents / 旧版技能库"
};

const SKILL_NAME_ZH = {
  accessibility: "无障碍设计",
  "agent-harness-construction": "Agent 行为空间设计",
  "agentic-engineering": "Agent 工程实践",
  "ai-regression-testing": "AI 回归测试",
  "algorithmic-art": "算法艺术",
  "api-design": "API 设计",
  "article-writing": "文章写作",
  "backend-patterns": "后端模式",
  "brand-guidelines": "品牌规范",
  "browser-qa": "浏览器质检",
  "canvas-design": "静态视觉设计",
  "coding-standards": "编码规范",
  "content-engine": "内容引擎",
  doc: "文档处理",
  "doc-coauthoring": "文档协作写作",
  "documentation-lookup": "文档检索",
  docx: "Word 文档",
  drawio: "draw.io 图表",
  "e2e-testing": "端到端测试",
  "eval-harness": "评测框架",
  "frontend-design": "前端设计",
  "frontend-patterns": "前端模式",
  "frontend-slides": "前端幻灯片",
  "html-ppt": "HTML 演示文稿",
  imagegen: "图片生成",
  "internal-comms": "内部沟通",
  "investor-materials": "投资人材料",
  "investor-outreach": "投资人外联",
  "market-research": "市场研究",
  "mcp-builder": "MCP 构建",
  "mcp-server-patterns": "MCP 服务模式",
  "nextjs-turbopack": "Next.js Turbopack",
  "openai-docs": "OpenAI 文档",
  pdf: "PDF 处理",
  "planning-with-files": "文件化规划",
  playwright: "Playwright 自动化",
  "plugin-creator": "插件创建",
  pptx: "PPT 演示文稿",
  pua: "高压推进策略",
  screenshot: "截图工具",
  "security-review": "安全审查",
  "server-upload": "服务器上传",
  "skill-creator": "技能创建",
  "skill-installer": "技能安装",
  "slack-gif-creator": "Slack GIF 制作",
  "springboot-patterns": "Spring Boot 模式",
  "springboot-security": "Spring Boot 安全",
  "springboot-tdd": "Spring Boot 测试驱动",
  "springboot-verification": "Spring Boot 验证",
  "strategic-compact": "上下文压缩策略",
  "tdd-workflow": "TDD 工作流",
  "theme-factory": "主题工厂",
  "thesis-docx": "论文 Word 排版",
  "thesis-standardizer": "论文标准化",
  "ui-ux-pro-max": "UI/UX 设计助手",
  "verification-loop": "验证闭环",
  "web-artifacts-builder": "Web 成品构建",
  "webapp-testing": "Web 应用测试",
  "windows-large-file-writes": "Windows 大文件写入",
  xlsx: "Excel 表格",
  openai: "OpenAI",
  superpowers: "超级能力"
};

const SKILL_DESCRIPTION_ZH = {
  accessibility: "用于按 WCAG 2.2 AA 标准设计、实现和审查更具包容性的数字产品。",
  "agent-harness-construction": "用于设计和优化 AI Agent 的动作空间、工具定义与观察格式，以提升任务完成率。",
  "agentic-engineering": "用于以更工程化的方式构建 Agent，包括先评测、再执行、再验证的工作方式。",
  "ai-regression-testing": "用于 AI 协助开发场景下的回归测试，重点覆盖无数据库依赖测试、自动查错与模型盲点识别。",
  "algorithmic-art": "用于使用 p5.js 创建带种子随机性和交互参数的原创算法艺术作品。",
  "api-design": "用于设计生产可用的 REST API，包括资源命名、状态码、分页、筛选和错误响应等。",
  "article-writing": "用于撰写文章、教程、博客和长篇内容，并保持统一的风格与结构。",
  "backend-patterns": "用于 Node.js、Express 和 Next.js API 路由的后端架构、接口设计与性能优化。",
  "brand-guidelines": "用于需要遵循品牌颜色、字体与视觉风格的界面、文档或物料。",
  "browser-qa": "用于在部署后通过浏览器自动化完成页面交互检查与视觉验收。",
  "canvas-design": "用于生成海报、视觉稿或其他静态设计作品，强调原创性与整体美感。",
  "coding-standards": "用于统一项目中的命名、可读性、不可变性与通用代码质量约定。",
  "content-engine": "用于为 X、LinkedIn、TikTok、YouTube、Newsletter 等平台设计内容生产与分发方案。",
  doc: "用于读取、创建或编辑 .docx 文档，尤其适合对格式与版式要求较高的任务。",
  "doc-coauthoring": "用于以协作方式写技术文档、提案、规格说明与结构化文稿。",
  "documentation-lookup": "用于通过最新官方文档而非训练记忆来查找库、框架和 API 的用法。",
  docx: "用于创建、编辑、整理和格式化 Word 文档，包括目录、页码、页眉页脚和批量替换等。",
  drawio: "用于创建流程图、架构图、ER 图、时序图、网络图和 UI 草图等各类图表。",
  "e2e-testing": "用于 Playwright 端到端测试的组织、配置、CI 集成与抗脆弱实践。",
  "eval-harness": "用于建立正式评测框架，帮助 Agent 会话按评测驱动方式推进。",
  "frontend-design": "用于构建或重塑网页、落地页、控制台和 React 组件，强调高质量视觉设计。",
  "frontend-patterns": "用于 React、Next.js、状态管理、性能优化和前端工程实践。",
  "frontend-slides": "用于创建 HTML 幻灯片、将 PPT 转网页或制作演讲展示型页面。",
  "html-ppt": "用于制作高质量的 HTML 演示文稿、分享稿和多页汇报展示。",
  imagegen: "用于生成或编辑位图类图片资源，例如插画、纹理、贴图、透明背景素材等。",
  "internal-comms": "用于撰写状态汇报、领导更新、FAQ、内部公告等企业内部沟通内容。",
  "investor-materials": "用于创建融资路演、投资人一页纸、融资备忘录与相关材料。",
  "investor-outreach": "用于撰写冷启动邮件、暖介绍、跟进邮件和投资人沟通文案。",
  "market-research": "用于做市场调研、竞品分析、投资尽调与行业研究。",
  "mcp-builder": "用于构建高质量 MCP 服务器，使模型能通过工具访问外部服务。",
  "mcp-server-patterns": "用于基于 Node/TypeScript SDK 构建 MCP Server，包括工具、资源和校验模式。",
  "nextjs-turbopack": "用于 Next.js 16+ 与 Turbopack 的构建策略、缓存机制和适用场景判断。",
  "openai-docs": "用于在 OpenAI 产品或 API 场景中优先基于官方文档给出实现建议。",
  pdf: "用于读取、拆分、合并、旋转、加水印、OCR 或生成 PDF 文件。",
  "planning-with-files": "用于通过 task_plan、findings 和 progress 等文件管理复杂任务过程。",
  playwright: "用于在终端中驱动真实浏览器完成导航、表单填写、截图和问题排查。",
  "plugin-creator": "用于创建或更新本地 Codex 插件目录与基础插件结构。",
  pptx: "用于创建、读取、修改、拆分和整合 PowerPoint 演示文稿。",
  pua: "用于在任务多次失败、反复卡住或需要强推进时，切换到更激进的问题解决模式。",
  screenshot: "用于在用户明确需要系统级桌面截图时完成全屏、窗口或区域截图。",
  "security-review": "用于处理认证、用户输入、敏感接口、支付或密钥相关需求时进行安全检查。",
  "server-upload": "用于将本地文件上传到服务器或远程环境的相关工作流。",
  "skill-creator": "用于创建新的技能或更新现有技能，以扩展 Codex 的能力。",
  "skill-installer": "用于从技能列表或 GitHub 仓库安装 Codex skills。",
  "slack-gif-creator": "用于制作适配 Slack 的动画 GIF，并满足尺寸、循环与清晰度要求。",
  "springboot-patterns": "用于 Java Spring Boot 后端的分层架构、REST API、缓存和异步处理等实践。",
  "springboot-security": "用于 Spring Boot 服务中的认证、授权、校验、CSRF、防爆破和依赖安全。",
  "springboot-tdd": "用于在 Spring Boot 项目里用 JUnit、Mockito、MockMvc 和 Testcontainers 做测试驱动开发。",
  "springboot-verification": "用于 Spring Boot 项目的构建、静态检查、测试覆盖和发布前验证。",
  "strategic-compact": "用于在复杂任务的阶段切换点进行人工上下文压缩，避免上下文膨胀。",
  "tdd-workflow": "用于新功能、Bug 修复或重构时坚持测试驱动开发，并提升覆盖率。",
  "theme-factory": "用于给页面、文档、报告或演示文稿生成统一的颜色和字体主题。",
  "thesis-docx": "用于严格控制论文或毕业设计 Word 文档中的章节、页码、标题和图表格式。",
  "thesis-standardizer": "用于将论文、模板、代码、截图和研究材料统一整理成标准化毕业论文。",
  "ui-ux-pro-max": "用于在设计方向不明确时帮助选择 UI 风格、配色、字体和布局方案。",
  "verification-loop": "用于在开发会话中建立系统性的验证闭环，降低遗漏与回归风险。",
  "web-artifacts-builder": "用于构建更复杂的 HTML 成品、React 页面、Tailwind 项目和路由状态界面。",
  "webapp-testing": "用于通过 Playwright 对本地 Web 应用进行交互测试、日志排查与截图验证。",
  "windows-large-file-writes": "用于在 Windows 环境下安全处理大内容写文件、超长命令和补丁写入问题。",
  xlsx: "用于读取、编辑、清洗、计算和生成 Excel、CSV、TSV 等表格文件。"
};

function fallbackTranslateDescription(text) {
  return text || "";
}

function getSkillTranslation(skill) {
  return {
    nameZh: SKILL_NAME_ZH[skill.name] || skill.name,
    descriptionZh: SKILL_DESCRIPTION_ZH[skill.name] || fallbackTranslateDescription(skill.description),
    sourceLabelZh: SOURCE_LABEL_ZH[skill.sourceId] || skill.sourceLabel,
    categoryLabelZh: CATEGORY_LABEL_ZH[skill.category.key] || skill.category.label
  };
}

function attachReportTranslations(report) {
  const translatedSkills = report.skills.map((skill) => ({
    ...skill,
    translation: getSkillTranslation(skill)
  }));

  const skillMap = new Map(
    translatedSkills.map((skill) => [`${skill.sourceId}::${skill.relativePath}::${skill.name}`, skill])
  );

  const translatedSources = report.sources.map((source) => ({
    ...source,
    labelZh: SOURCE_LABEL_ZH[source.id] || source.label,
    skills: source.skills.map((skill) => skillMap.get(`${skill.sourceId}::${skill.relativePath}::${skill.name}`) || skill)
  }));

  const translatedSummary = {
    ...report.summary,
    sourceStates: report.summary.sourceStates.map((source) => ({
      ...source,
      labelZh: SOURCE_LABEL_ZH[source.id] || source.label
    })),
    categorySummary: report.summary.categorySummary.map((category) => ({
      ...category,
      labelZh: CATEGORY_LABEL_ZH[category.key] || category.label
    }))
  };

  return {
    ...report,
    sources: translatedSources,
    summary: translatedSummary,
    skills: translatedSkills
  };
}

module.exports = {
  attachReportTranslations,
  CATEGORY_LABEL_ZH,
  SOURCE_LABEL_ZH,
  SKILL_NAME_ZH,
  SKILL_DESCRIPTION_ZH
};
