const state = {
  report: null,
  filteredSkills: [],
  selectedSkillKey: null
};

const elements = {
  includeAgents: document.getElementById("includeAgents"),
  useTranslation: document.getElementById("useTranslation"),
  scanButton: document.getElementById("scanButton"),
  scanStatus: document.getElementById("scanStatus"),
  totalSkills: document.getElementById("totalSkills"),
  totalSources: document.getElementById("totalSources"),
  systemSkills: document.getElementById("systemSkills"),
  sharedCount: document.getElementById("sharedCount"),
  codexOnlyCount: document.getElementById("codexOnlyCount"),
  claudeOnlyCount: document.getElementById("claudeOnlyCount"),
  sourceStrip: document.getElementById("sourceStrip"),
  categoryChart: document.getElementById("categoryChart"),
  sourceCards: document.getElementById("sourceCards"),
  codexOnlyList: document.getElementById("codexOnlyList"),
  searchInput: document.getElementById("searchInput"),
  sourceFilter: document.getElementById("sourceFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  resultCount: document.getElementById("resultCount"),
  skillsTable: document.getElementById("skillsTable"),
  skillDetail: document.getElementById("skillDetail")
};

boot();

function boot() {
  bindEvents();
  runScan();
}

function bindEvents() {
  elements.scanButton.addEventListener("click", () => runScan());
  elements.useTranslation.addEventListener("change", () => {
    renderReport(state.report);
    applyFilters();
  });
  elements.searchInput.addEventListener("input", () => applyFilters());
  elements.sourceFilter.addEventListener("change", () => applyFilters());
  elements.categoryFilter.addEventListener("change", () => applyFilters());
}

async function runScan() {
  setStatus("loading", "扫描中");
  elements.scanButton.disabled = true;

  try {
    const report = await window.skillsApp.scan({
      includeAgents: elements.includeAgents.checked
    });

    state.report = report;
    hydrateFilters(report);
    renderReport(report);
    applyFilters();
    setStatus("done", "扫描完成");
  } catch (error) {
    console.error(error);
    setStatus("error", "扫描失败");
    elements.skillDetail.className = "skill-detail empty";
    elements.skillDetail.innerHTML = `<p>${escapeHtml(error.message || "未知错误")}</p>`;
  } finally {
    elements.scanButton.disabled = false;
  }
}

function hydrateFilters(report) {
  const sourceOptions = report.summary.sourceStates.map((source) => ({
    value: source.id,
    label: `${getSourceLabel(source)} (${source.skillCount})`
  }));
  const categoryOptions = report.summary.categorySummary
    .filter((item) => item.total > 0)
    .map((item) => ({
      value: item.key,
      label: `${getCategoryLabel(item)} (${item.total})`
    }));

  refillSelect(elements.sourceFilter, "全部来源", sourceOptions);
  refillSelect(elements.categoryFilter, "全部分类", categoryOptions);
}

function renderReport(report) {
  renderTopStats(report);
  renderSourceStrip(report);
  renderComparePanel(report);
  renderCategoryChart(report);
  renderSourceCards(report);
}

function renderTopStats(report) {
  elements.totalSkills.textContent = report.summary.totals.skillsDetected;
  elements.totalSources.textContent = report.summary.totals.sourcesDetected;
  elements.systemSkills.textContent = report.summary.totals.systemSkills;
}

function renderSourceStrip(report) {
  const maxCount = Math.max(...report.summary.sourceStates.map((source) => source.skillCount), 1);

  elements.sourceStrip.innerHTML = report.summary.sourceStates
    .map((source) => {
      const width = `${(source.skillCount / maxCount) * 100}%`;
      return `
        <div class="source-strip-item">
          <span class="source-strip-name">${escapeHtml(getSourceLabel(source))}</span>
          <div class="source-strip-bar">
            <div class="source-strip-fill" style="width:${width}"></div>
          </div>
          <span class="source-strip-value">${source.skillCount}</span>
        </div>
      `;
    })
    .join("");
}

function renderComparePanel(report) {
  const compare = report.summary.comparisons.codexVsClaude;
  elements.sharedCount.textContent = compare.shared.length;
  elements.codexOnlyCount.textContent = compare.codexOnly.length;
  elements.claudeOnlyCount.textContent = compare.claudeOnly.length;

  elements.codexOnlyList.innerHTML = createTokenList(
    compare.codexOnly.slice(0, 24).map((name) => translateSkillName(name))
  );
}

function renderCategoryChart(report) {
  const maxCount = Math.max(...report.summary.categorySummary.map((item) => item.total), 1);

  elements.categoryChart.innerHTML = report.summary.categorySummary
    .filter((item) => item.total > 0)
    .map((item) => {
      const width = `${(item.total / maxCount) * 100}%`;
      return `
        <div class="category-row">
          <div class="category-meta">
            <span>${escapeHtml(getCategoryLabel(item))}</span>
            <span>${item.total}</span>
          </div>
          <div class="category-bar">
            <div class="category-fill" style="width:${width}"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderSourceCards(report) {
  elements.sourceCards.innerHTML = report.summary.sourceStates
    .map((source) => {
      const status = source.exists ? "已检测" : "未找到";
      return `
        <div class="source-card">
          <h3>${escapeHtml(getSourceLabel(source))}</h3>
          <p class="source-card-count">${source.skillCount}</p>
          <p class="source-card-path">${escapeHtml(source.rootPath)}</p>
          <span class="source-card-tag">${escapeHtml(status)} · ${escapeHtml(source.kind)}</span>
        </div>
      `;
    })
    .join("");
}

function applyFilters() {
  if (!state.report) {
    return;
  }

  const keyword = elements.searchInput.value.trim().toLowerCase();
  const sourceId = elements.sourceFilter.value;
  const categoryKey = elements.categoryFilter.value;

  state.filteredSkills = state.report.skills.filter((skill) => {
    const matchesKeyword =
      !keyword ||
      [
        skill.name,
        skill.description,
        skill.sourceLabel,
        skill.relativePath,
        skill.translation?.nameZh,
        skill.translation?.descriptionZh,
        skill.translation?.sourceLabelZh,
        skill.translation?.categoryLabelZh
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    const matchesSource = sourceId === "all" || skill.sourceId === sourceId;
    const matchesCategory = categoryKey === "all" || skill.category.key === categoryKey;

    return matchesKeyword && matchesSource && matchesCategory;
  });

  elements.resultCount.textContent = `${state.filteredSkills.length} 条`;

  if (
    !state.selectedSkillKey ||
    !state.filteredSkills.some((skill) => getSkillKey(skill) === state.selectedSkillKey)
  ) {
    state.selectedSkillKey = state.filteredSkills[0] ? getSkillKey(state.filteredSkills[0]) : null;
  }

  renderSkillTable();
  renderSelectedSkill();
}

function renderSkillTable() {
  if (state.filteredSkills.length === 0) {
    elements.skillsTable.innerHTML = '<div class="empty-state">当前筛选条件下没有匹配的 skill。</div>';
    return;
  }

  elements.skillsTable.innerHTML = state.filteredSkills
    .map((skill) => {
      const key = getSkillKey(skill);
      const isActive = key === state.selectedSkillKey;
      const chips = [
        getCategoryLabel(skill.category, skill),
        getSourceLabel(skill),
        skill.visibility === "system" ? "系统" : null,
        skill.stats.hasScripts ? "脚本" : null,
        skill.stats.hasAgents ? "agents" : null
      ]
        .filter(Boolean)
        .map((label) => `<span class="meta-chip">${escapeHtml(label)}</span>`)
        .join("");

      return `
        <button class="skill-row ${isActive ? "active" : ""}" data-skill-key="${escapeHtml(key)}">
          <div class="skill-row-top">
            <span class="skill-name">${escapeHtml(getSkillName(skill))}</span>
            <span class="skill-source">${escapeHtml(getSourceLabel(skill))}</span>
          </div>
          <p class="skill-desc">${escapeHtml(getSkillDescription(skill) || "未提取到描述。")}</p>
          ${
            shouldUseTranslation() && skill.translation?.nameZh && skill.translation.nameZh !== skill.name
              ? `<p class="skill-subname">原名：${escapeHtml(skill.name)}</p>`
              : ""
          }
          <div class="skill-meta">${chips}</div>
        </button>
      `;
    })
    .join("");

  for (const button of elements.skillsTable.querySelectorAll(".skill-row")) {
    button.addEventListener("click", () => {
      state.selectedSkillKey = button.dataset.skillKey;
      renderSkillTable();
      renderSelectedSkill();
    });
  }
}

function renderSelectedSkill() {
  if (!state.selectedSkillKey) {
    elements.skillDetail.className = "skill-detail empty";
    elements.skillDetail.innerHTML = "<p>暂无可展示的 skill。</p>";
    return;
  }

  const skill = state.filteredSkills.find((item) => getSkillKey(item) === state.selectedSkillKey);
  if (!skill) {
    elements.skillDetail.className = "skill-detail empty";
    elements.skillDetail.innerHTML = "<p>当前选择的 skill 不在筛选结果中。</p>";
    return;
  }

  const tags = createDetailTags(skill);

  elements.skillDetail.className = "skill-detail";
  elements.skillDetail.innerHTML = `
    <div class="detail-title">
      <h2>${escapeHtml(getSkillName(skill))}</h2>
      ${
        shouldUseTranslation() && skill.translation?.nameZh && skill.translation.nameZh !== skill.name
          ? `<p class="detail-origin-name">原始名称：${escapeHtml(skill.name)}</p>`
          : ""
      }
      <p>${escapeHtml(getSkillDescription(skill) || "未提取到描述。")}</p>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <h3>来源</h3>
        <p>${escapeHtml(getSourceLabel(skill))} / ${escapeHtml(skill.sourceKind)}</p>
      </div>
      <div class="detail-item">
        <h3>分类</h3>
        <p>${escapeHtml(getCategoryLabel(skill.category, skill))}</p>
      </div>
      <div class="detail-item">
        <h3>相对路径</h3>
        <p>${escapeHtml(skill.relativePath)}</p>
      </div>
      <div class="detail-item">
        <h3>技能目录</h3>
        <p>${escapeHtml(skill.skillDir)}</p>
      </div>
      <div class="detail-item">
        <h3>SKILL.md</h3>
        <p>${escapeHtml(skill.skillMdPath)}</p>
      </div>
      <div class="detail-item">
        <h3>标签</h3>
        <div class="detail-tags">${tags}</div>
      </div>
    </div>
  `;
}

function createDetailTags(skill) {
  const tags = [
    skill.visibility === "system" ? "系统" : "普通",
    skill.stats.hasScripts ? "脚本" : null,
    skill.stats.hasAgents ? "agents" : null,
    skill.stats.hasReferences ? "参考资料" : null,
    skill.stats.hasTemplates ? "模板" : null,
    skill.stats.hasThemes ? "主题" : null,
    skill.frontmatter.origin ? `来源标记:${skill.frontmatter.origin}` : null
  ].filter(Boolean);

  if (tags.length === 0) {
    return '<span class="meta-chip">无附加标签</span>';
  }

  return tags.map((tag) => `<span class="meta-chip">${escapeHtml(tag)}</span>`).join("");
}

function refillSelect(select, defaultLabel, options) {
  const currentValue = select.value;
  select.innerHTML = [`<option value="all">${escapeHtml(defaultLabel)}</option>`]
    .concat(options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`))
    .join("");

  if (options.some((option) => option.value === currentValue)) {
    select.value = currentValue;
  } else {
    select.value = "all";
  }
}

function setStatus(type, text) {
  elements.scanStatus.className = `status-pill ${type}`;
  elements.scanStatus.textContent = text;
}

function getSkillKey(skill) {
  return `${skill.sourceId}::${skill.relativePath}::${skill.name}`;
}

function createTokenList(items) {
  if (!items.length) {
    return '<span class="token muted">无</span>';
  }
  return items.map((item) => `<span class="token">${escapeHtml(item)}</span>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shouldUseTranslation() {
  return elements.useTranslation.checked;
}

function getSkillName(skill) {
  if (shouldUseTranslation() && skill.translation?.nameZh) {
    return skill.translation.nameZh;
  }
  return skill.name;
}

function getSkillDescription(skill) {
  if (shouldUseTranslation() && skill.translation?.descriptionZh) {
    return skill.translation.descriptionZh;
  }
  return skill.description;
}

function getSourceLabel(sourceOrSkill) {
  if (shouldUseTranslation() && sourceOrSkill.labelZh) {
    return sourceOrSkill.labelZh;
  }
  if (shouldUseTranslation() && sourceOrSkill.translation?.sourceLabelZh) {
    return sourceOrSkill.translation.sourceLabelZh;
  }
  return sourceOrSkill.label || sourceOrSkill.sourceLabel;
}

function getCategoryLabel(categoryOrSummary, skill) {
  if (shouldUseTranslation()) {
    if (categoryOrSummary.labelZh) {
      return categoryOrSummary.labelZh;
    }
    if (skill?.translation?.categoryLabelZh) {
      return skill.translation.categoryLabelZh;
    }
  }
  return categoryOrSummary.label;
}

function translateSkillName(name) {
  if (!shouldUseTranslation() || !state.report) {
    return name;
  }
  const matched = state.report.skills.find((skill) => skill.name === name);
  return matched?.translation?.nameZh || name;
}
