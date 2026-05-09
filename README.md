# 本地 Skills Radar

这是一个纯本地的 `Electron` 桌面工具，用来扫描你电脑上的 `Codex`、`Claude Code`、`Agents / Legacy` skills，并生成带有“分类归属 + 来源对比 + 数据大屏”效果的总览界面。

整个项目不接任何 AI 能力，也不依赖外部接口，核心就是：

- 扫描本地目录
- 识别标准 `SKILL.md`
- 自动提取 `name`、`description`、`origin`
- 自动做分类归属
- 内置本地中英翻译显示
- 用桌面大屏方式展示结果

它默认会扫描这些目录：

- `~/.codex/skills`
- `~/.claude/skills`
- `~/.agents/skills`

其中前两个是主目标，第三个会作为额外来源一起统计，方便你排查“本地其实还有哪些 skills”。

## 功能

- 自动递归扫描本地 skills
- 自动分类汇总
- 对比 `Codex` 和 `Claude Code` 的共有技能、独有技能
- 可切换中文翻译显示
- 桌面大屏总览界面
- 搜索、来源筛选、分类筛选
- 选中 skill 查看详情
- 输出 `Markdown` 报告和 `JSON` 报告
- 支持追加自定义 skills 根目录

## 启动桌面版

先安装依赖：

```bash
npm install
```

然后启动 Electron 桌面版：

```bash
npm run start
```

启动后会直接打开本地窗口，点击“重新扫描”即可刷新当前机器上的 skills 数据。

## 命令行模式

如果你还想保留命令行输出报告，也可以继续使用：

```bash
npm run scan
```

默认会在项目下生成：

- `reports/skills-summary.md`
- `reports/skills-summary.json`

只输出 Markdown：

```bash
npm run scan -- --format md
```

跳过 `~/.agents/skills`：

```bash
npm run scan -- --skip-agents
```

追加自定义技能目录：

```bash
npm run scan -- --source myskills=D:\skills
```

自定义输出目录：

```bash
npm run scan -- --output-dir dist
```

## 报告内容

桌面版大屏会包含：

- 技能总数
- 技能源状态
- Codex / Claude Code 对比
- 分类分布
- 技能明细检索
- 单个 skill 详情

Markdown 报告里会包含：

- 技能源状态
- Codex / Claude Code 对比
- 分类统计
- 详细技能清单
- 重名技能提示

JSON 报告适合你后续继续做：

- Web 页面展示
- 本地桌面工具
- 自动同步
- 二次分类
- 搜索和筛选

## 项目结构

- `src/scanner.js`：扫描与统计核心
- `src/reportRenderer.js`：Markdown 报告生成
- `electron/main.js`：Electron 主进程
- `electron/preload.js`：本地 IPC 桥接
- `renderer/`：桌面大屏界面

## Electron 启动注意事项

你这台机器当前环境里存在：

```bash
ELECTRON_RUN_AS_NODE=1
```

这个变量会让 Electron 退化成 Node 模式，表现出来就是：

- 程序有 Electron 版本号
- 但 `app.whenReady()` 之类主进程 API 不能用
- 窗口起不来

现在项目里的 `npm run start` 已经在启动前自动清掉这个变量，所以你直接跑脚本就行。

## 现在的实现方式

当前是：

- 本地 Node 文件扫描
- 本地 Electron 桌面承载
- 本地 HTML / CSS / JS 数据大屏界面
- 不调用任何 AI 服务

## 后续可继续加的方向

- 支持新增自定义扫描目录
- 支持点击导出当前筛选结果
- 增加重名技能专题视图
- 增加目录变化监听后自动刷新
- 增加分类规则编辑能力
- 监听目录变化后自动重新生成报告
