(() => {
  const STORAGE_KEY = "career_plan_data";
  const THEME_STORAGE_KEY = "career_theme";
  const POLICY_CUSTOM_STORAGE_KEY = "career_policy_custom_items";
  const CHANGE_EVENT = "career-plan-data-change";
  const NODE_TYPES = {
    major: { label: "专业", title: "新专业", colors: ["rgba(255, 214, 102, 0.28)", "rgba(255, 183, 77, 0.26)"] },
    career: { label: "职业", title: "新职业", colors: ["rgba(128, 203, 196, 0.28)", "rgba(129, 212, 250, 0.24)"] },
    position: { label: "职位", title: "新职位", colors: ["rgba(206, 147, 216, 0.26)", "rgba(244, 143, 177, 0.24)"] },
  };
  const THEMES = [
    {
      id: "classic",
      name: "经典墨绿",
      bgColor: "#2b4b3a",
      chalkColor: "#ffffff",
      nodeBg: "rgba(255,255,255,0.15)",
      edgeColor: "#ff7b54",
    },
    {
      id: "dark",
      name: "星空暗蓝",
      bgColor: "#0a0e27",
      chalkColor: "#b8c6ff",
      nodeBg: "rgba(255,255,255,0.08)",
      edgeColor: "#7b68ee",
    },
    {
      id: "warm",
      name: "暖阳灰",
      bgColor: "#3d2c1e",
      chalkColor: "#f5e6c8",
      nodeBg: "rgba(255,200,150,0.15)",
      edgeColor: "#e8a87c",
    },
    {
      id: "ocean",
      name: "深海蓝",
      bgColor: "#0b2b3a",
      chalkColor: "#a8e6cf",
      nodeBg: "rgba(100,200,255,0.10)",
      edgeColor: "#4fc3f7",
    },
  ];

  const POLICY_LIBRARY = [
    {
      id: "policy-digital-economy",
      title: "“十四五”数字经济发展规划",
      type: "national",
      date: "2022-01",
      summary: "强调数字产业化、产业数字化和数字人才供给。",
      link: "https://www.gov.cn/zhengce/content/2022-01/12/content_5667817.htm",
      relatedMajorIds: ["computer-science", "electronic-information", "microelectronics", "economics", "finance"],
    },
    {
      id: "policy-ai-development",
      title: "新一代人工智能发展规划",
      type: "national",
      date: "2017-07",
      summary: "围绕人工智能基础理论、关键技术和产业应用布局。",
      link: "https://www.gov.cn/zhengce/content/2017-07/20/content_5211996.htm",
      relatedMajorIds: ["computer-science", "electronic-information", "microelectronics"],
    },
    {
      id: "policy-ic-software",
      title: "集成电路和软件产业高质量发展政策",
      type: "national",
      date: "2020-08",
      summary: "支持集成电路、软件、EDA和关键基础技术发展。",
      link: "https://www.gov.cn/zhengce/content/2020-08/04/content_5532370.htm",
      relatedMajorIds: ["microelectronics", "electronic-information", "computer-science", "materials"],
    },
    {
      id: "policy-smart-manufacturing",
      title: "智能制造发展规划政策线索",
      type: "national",
      date: "2021-12",
      summary: "聚焦装备升级、工业软件、机器人和制造业数字化。",
      link: "https://www.gov.cn/search/?t=zhengce&q=%E6%99%BA%E8%83%BD%E5%88%B6%E9%80%A0%20%E5%8F%91%E5%B1%95%E8%A7%84%E5%88%92",
      relatedMajorIds: ["mechanical-robotics", "electrical-engineering", "materials", "electronic-information"],
    },
    {
      id: "policy-health-china",
      title: "健康中国行动政策线索",
      type: "national",
      date: "2019-07",
      summary: "面向医疗服务、公共卫生、健康管理和医学人才培养。",
      link: "https://www.gov.cn/search/?t=zhengce&q=%E5%81%A5%E5%BA%B7%E4%B8%AD%E5%9B%BD%20%E8%A1%8C%E5%8A%A8",
      relatedMajorIds: ["medicine"],
    },
    {
      id: "policy-rule-of-law",
      title: "法治中国建设规划政策线索",
      type: "national",
      date: "2021-01",
      summary: "关注法治政府、司法体系、法律服务和合规治理。",
      link: "https://www.gov.cn/search/?t=zhengce&q=%E6%B3%95%E6%B2%BB%E4%B8%AD%E5%9B%BD%20%E5%BB%BA%E8%AE%BE%E8%A7%84%E5%88%92",
      relatedMajorIds: ["law"],
    },
    {
      id: "policy-accounting-digital",
      title: "会计信息化与会计改革政策线索",
      type: "national",
      date: "2021-12",
      summary: "围绕会计数字化、管理会计、财会监督和人才建设。",
      link: "https://www.gov.cn/search/?t=zhengce&q=%E4%BC%9A%E8%AE%A1%20%E4%BF%A1%E6%81%AF%E5%8C%96%20%E6%94%B9%E9%9D%A9",
      relatedMajorIds: ["accounting"],
    },
    {
      id: "policy-fintech",
      title: "金融科技发展政策线索",
      type: "national",
      date: "2022-01",
      summary: "关注金融数字化、风控科技、数据治理与复合人才。",
      link: "https://www.gov.cn/search/?t=zhengce&q=%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80%20%E5%8F%91%E5%B1%95%E8%A7%84%E5%88%92",
      relatedMajorIds: ["finance", "economics", "computer-science"],
    },
    {
      id: "policy-beijing-ai",
      title: "北京市人工智能产业政策线索",
      type: "local",
      province: "北京",
      date: "2024",
      summary: "聚焦大模型、智能算力、AI应用和高层次人才引进。",
      link: "https://www.beijing.gov.cn/so/s?qt=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%20%E4%BA%BA%E6%89%8D",
      relatedMajorIds: ["computer-science", "electronic-information", "microelectronics"],
    },
    {
      id: "policy-shanghai-ic",
      title: "上海市集成电路产业政策线索",
      type: "local",
      province: "上海",
      date: "2024",
      summary: "关注芯片设计、制造、封测、装备材料和人才支持。",
      link: "https://www.shanghai.gov.cn/search?q=%E9%9B%86%E6%88%90%E7%94%B5%E8%B7%AF%20%E4%BA%BA%E6%89%8D",
      relatedMajorIds: ["microelectronics", "electronic-information", "materials"],
    },
    {
      id: "policy-guangdong-manufacturing",
      title: "广东省制造业高质量发展政策线索",
      type: "local",
      province: "广东",
      date: "2024",
      summary: "面向智能制造、机器人、新能源、电子信息等重点方向。",
      link: "https://www.gd.gov.cn/gdywdt/zwzt/szzc/index.html",
      relatedMajorIds: ["mechanical-robotics", "electrical-engineering", "electronic-information", "materials"],
    },
    {
      id: "policy-zhejiang-digital",
      title: "浙江省数字经济人才政策线索",
      type: "local",
      province: "浙江",
      date: "2024",
      summary: "围绕数字经济、平台经济、数据要素和复合型人才。",
      link: "https://www.zj.gov.cn/search/?q=%E6%95%B0%E5%AD%97%E7%BB%8F%E6%B5%8E%20%E4%BA%BA%E6%89%8D",
      relatedMajorIds: ["computer-science", "economics", "finance", "electronic-information"],
    },
  ];

  const PET_SELECTED_KEY = "career_pet_selected";
  const PET_CONFIGS = {
    dodo: {
      id: "dodo",
      name: "豆豆",
      emoji: "🧡",
      colors: { body: "#FFB74D", highlight: "#FFE0B2", shadow: "#F09040", outline: "#F97316" },
      features: { headAccessory: "sprout", hasBlush: true, eyeStyle: "round", mouthCurve: "happy" },
      welcomeMessage: "嗨！我是豆豆，一起冲鸭！🚀",
    },
    luna: {
      id: "luna",
      name: "月月",
      emoji: "💜",
      colors: { body: "#B39DDB", highlight: "#EDE7F6", shadow: "#7E57C2", outline: "#6D35B8" },
      features: { headAccessory: "moon", hasBlush: false, eyeStyle: "slanted", mouthCurve: "calm" },
      welcomeMessage: "我是月月，让我们理性规划未来 ✨",
    },
    sprout: {
      id: "sprout",
      name: "芽芽",
      emoji: "💚",
      colors: { body: "#81C784", highlight: "#C8E6C9", shadow: "#4CAF50", outline: "#2F8F46" },
      features: { headAccessory: "leaves", hasBlush: true, eyeStyle: "watery", mouthCurve: "gentle" },
      welcomeMessage: "我是芽芽，每一步都算数 🌱",
    },
  };

  const PET_QUOTES = {
    happy: [
      "种一棵树最好的时间是十年前，其次是现在。",
      "选择比努力更重要，但努力让你有更多选择。",
      "你的职业规划，就是你的未来地图。",
      "路线越来越清楚啦，继续推进！",
    ],
    worried: [
      "别慌，调整节奏，继续前进。",
      "逾期不可怕，可怕的是放弃规划。",
      "重新评估目标，有时候转弯也是进步。",
      "把大目标拆小，今天先补一小步。",
    ],
    surprised: [
      "哇，灵感爆发！记得给新节点补备注。",
      "一下子新增好多目标，路线正在长出来！",
      "好快的手速，把关键节点连起来吧。",
    ],
    calm: [
      "每天进步一点点，一年后就是巨大的飞跃。",
      "职业规划不是终点，而是不断迭代的过程。",
      "先看方向，再看路径，最后看行动。",
      "长期主义，也需要今天的小动作。",
      "把证书、项目和岗位放在同一张图里，会清楚很多。",
      "做选择时，记得同时看兴趣、能力和市场。",
      "当你能解释自己的路线，机会就更容易靠近你。",
      "不要只收集信息，也要安排下一步行动。",
      "路径不是一次画完的，它会随着你成长而更新。",
      "把不确定写下来，它就没那么吓人了。",
    ],
  };

  const defaultPlan = {
    id: "default-career-plan",
    nodes: [
      { id: "sample-major", type: "major", title: "计算机科学", x: 240, y: 220, color: "rgba(255, 214, 102, 0.28)" },
      { id: "sample-career", type: "career", title: "后端工程师", x: 520, y: 330, color: "rgba(128, 203, 196, 0.28)" },
      { id: "sample-position", type: "position", title: "高级架构师", x: 820, y: 230, color: "rgba(206, 147, 216, 0.26)" },
    ],
    edges: [
      { id: "sample-edge-1", sourceId: "sample-major", targetId: "sample-career" },
      { id: "sample-edge-2", sourceId: "sample-career", targetId: "sample-position" },
    ],
    notes: [
      {
        id: "sample-note-1",
        nodeId: "sample-career",
        planDate: "2026-09-01",
        completeDate: "",
        content: "补齐数据库、网络、工程化和项目经验，准备投递后端研发岗位。",
      },
    ],
  };

  let plan = readPlan();
  let currentTheme = readTheme();
  let isBoardOpen = false;
  let themeMenuOpen = false;
  let catalogInitialized = false;
  let catalogSearchQuery = "";
  let catalogPanelCollapsed = false;
  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth();
  let calendarActiveDate = null;
  let calendarVisible = true;
  let policyPanelOpen = false;
  let policyPanelMajorId = "";
  let policyPanelMajorTitle = "";
  let policyPanelTab = "national";
  let expandedPolicyId = null;
  let policyRadarIndex = 0;
  let policyRadarTimer = null;
  let selectedPetId = readSelectedPetId();
  let petMessage = "";
  let petMessageTimer = null;
  let petDragging = null;
  let petClickSuppressed = false;
  let petEmotion = "calm";
  let petRecentNodeAdds = [];
  let petLastNodeCount = plan.nodes.length;
  let petSwitching = false;
  const catalogExpandedIds = new Set();
  let linkSourceId = null;
  let draggingNode = null;
  let draggingTool = null;
  let contextMenu = null;
  let activeNoteNodeId = null;
  let nodeSizes = {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`;
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function readPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultPlan);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || !Array.isArray(parsed.notes)) {
        return clone(defaultPlan);
      }
      return parsed;
    } catch (error) {
      return clone(defaultPlan);
    }
  }

  function readTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return THEMES.find((theme) => theme.id === stored) || THEMES[0];
    } catch (error) {
      return THEMES[0];
    }
  }

  function readSelectedPetId() {
    try {
      const stored = localStorage.getItem(PET_SELECTED_KEY);
      return PET_CONFIGS[stored] ? stored : "dodo";
    } catch (error) {
      return "dodo";
    }
  }

  function petPositionKey(id) {
    return `career_pet_pos_${id}`;
  }

  function petWelcomedKey(id) {
    return `career_pet_welcomed_${id}`;
  }

  function defaultPetPosition(mode) {
    const margin = mode === "board" ? 20 : 28;
    const width = mode === "board" ? 116 : 148;
    const height = mode === "board" ? 128 : 158;
    return mode === "board"
      ? { x: margin, y: Math.max(margin, window.innerHeight - height - margin) }
      : { x: Math.max(margin, window.innerWidth - width - margin), y: Math.max(margin, window.innerHeight - height - margin) };
  }

  function readPetPosition(id, mode) {
    try {
      const raw = localStorage.getItem(petPositionKey(id));
      if (!raw) return defaultPetPosition(mode);
      const parsed = JSON.parse(raw);
      if (!Number.isFinite(parsed.x) || !Number.isFinite(parsed.y)) return defaultPetPosition(mode);
      const maxX = Math.max(8, window.innerWidth - (mode === "board" ? 116 : 148));
      const maxY = Math.max(8, window.innerHeight - (mode === "board" ? 128 : 158));
      return {
        x: Math.min(Math.max(parsed.x, 8), maxX),
        y: Math.min(Math.max(parsed.y, 8), maxY),
      };
    } catch (error) {
      return defaultPetPosition(mode);
    }
  }

  function savePetPosition(id, x, y) {
    localStorage.setItem(petPositionKey(id), JSON.stringify({ x: Math.round(x), y: Math.round(y) }));
  }

  function calculatePetEmotion() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasOverdue = plan.notes.some((note) => {
      if (!note.completeDate) return false;
      const complete = new Date(`${note.completeDate}T00:00:00`);
      return !Number.isNaN(complete.getTime()) && complete < today;
    });
    if (hasOverdue) return "worried";
    if (petRecentNodeAdds.filter((time) => Date.now() - time <= 5000).length >= 2) return "surprised";
    if (plan.nodes.length >= 3) return "happy";
    return "calm";
  }

  function refreshPetEmotion() {
    petRecentNodeAdds = petRecentNodeAdds.filter((time) => Date.now() - time <= 5000);
    petEmotion = calculatePetEmotion();
  }

  function pickPetQuote() {
    refreshPetEmotion();
    const pool = PET_QUOTES[petEmotion]?.length ? PET_QUOTES[petEmotion] : PET_QUOTES.calm;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function showPetMessage(message) {
    petMessage = message || pickPetQuote();
    window.clearTimeout(petMessageTimer);
    petMessageTimer = window.setTimeout(() => {
      petMessage = "";
      renderHome();
      renderBoard();
    }, 3000);
    renderHome();
    renderBoard();
  }

  function switchPet(nextId) {
    if (!PET_CONFIGS[nextId]) return;
    selectedPetId = nextId;
    localStorage.setItem(PET_SELECTED_KEY, nextId);
    petSwitching = true;
    const welcomed = localStorage.getItem(petWelcomedKey(nextId)) === "true";
    if (!welcomed) {
      petMessage = PET_CONFIGS[nextId].welcomeMessage;
      localStorage.setItem(petWelcomedKey(nextId), "true");
      window.clearTimeout(petMessageTimer);
      petMessageTimer = window.setTimeout(() => {
        petMessage = "";
        renderHome();
        renderBoard();
      }, 3000);
    } else {
      petMessage = PET_CONFIGS[nextId].welcomeMessage;
      window.clearTimeout(petMessageTimer);
      petMessageTimer = window.setTimeout(() => {
        petMessage = "";
        renderHome();
        renderBoard();
      }, 2200);
    }
    renderHome();
    renderBoard();
    window.setTimeout(() => {
      petSwitching = false;
      renderHome();
      renderBoard();
    }, 420);
  }

  function switchToNextPet() {
    const ids = Object.keys(PET_CONFIGS);
    const index = ids.indexOf(selectedPetId);
    switchPet(ids[(index + 1) % ids.length]);
  }

  function renderPetAccessory(config) {
    if (config.features.headAccessory === "moon") return '<span class="career-pet-moon" aria-hidden="true"></span>';
    if (config.features.headAccessory === "leaves") {
      return '<span class="career-pet-leaves" aria-hidden="true"><i></i><i></i></span>';
    }
    if (config.features.headAccessory === "sprout") {
      return '<span class="career-pet-sprout" aria-hidden="true"><i></i><i></i></span>';
    }
    return "";
  }

  function renderDesktopPet(mode = "home") {
    const config = PET_CONFIGS[selectedPetId] || PET_CONFIGS.dodo;
    refreshPetEmotion();
    const position = readPetPosition(config.id, mode);
    const scale = mode === "board" ? 0.74 : 0.9;
    return `
      <div
        class="career-pet pet-${config.id} ${mode === "board" ? "is-board" : "is-home"} ${petDragging ? "is-dragging" : ""} ${petSwitching ? "is-switching" : ""} is-${petEmotion}"
        data-pet-root
        data-pet-mode="${mode}"
        style="left:${position.x}px; top:${position.y}px; --pet-body:${config.colors.body}; --pet-highlight:${config.colors.highlight}; --pet-shadow:${config.colors.shadow}; --pet-outline:${config.colors.outline}; --pet-scale:${scale};"
        aria-label="${escapeHtml(config.name)}桌宠"
      >
        ${petMessage ? `<div class="career-pet-bubble">${escapeHtml(petMessage)}</div>` : ""}
        <button type="button" class="career-pet-switch" data-pet-switch title="切换精灵">🔄</button>
        <div class="career-pet-shadow"></div>
        <div class="career-pet-body">
          <span class="career-pet-lobe top"></span>
          <span class="career-pet-lobe left"></span>
          <span class="career-pet-lobe right"></span>
          <span class="career-pet-gloss"></span>
          ${renderPetAccessory(config)}
          <span class="career-pet-sparkle one"></span>
          <span class="career-pet-sparkle two"></span>
          <span class="career-pet-eye left"></span>
          <span class="career-pet-eye right"></span>
          ${config.features.hasBlush ? '<span class="career-pet-blush left"></span><span class="career-pet-blush right"></span>' : ""}
          <span class="career-pet-mouth"></span>
          <span class="career-pet-arm left"></span>
          <span class="career-pet-arm right"></span>
          <span class="career-pet-star">★</span>
          <span class="career-pet-foot left"></span>
          <span class="career-pet-foot right"></span>
        </div>
        <div class="career-pet-menu" data-pet-menu>
          ${Object.values(PET_CONFIGS)
            .map((pet) => `<button type="button" data-pet-choice="${pet.id}" class="${pet.id === selectedPetId ? "is-active" : ""}">${pet.emoji} ${pet.name}</button>`)
            .join("")}
        </div>
      </div>
    `;
  }

  function changeTheme(themeId) {
    const nextTheme = THEMES.find((theme) => theme.id === themeId);
    if (!nextTheme) return;
    currentTheme = nextTheme;
    themeMenuOpen = false;
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
    renderHome();
    renderBoard();
  }

  function savePlan() {
    const previousNodeCount = petLastNodeCount;
    petLastNodeCount = plan.nodes.length;
    if (plan.nodes.length > previousNodeCount) {
      const now = Date.now();
      for (let index = 0; index < plan.nodes.length - previousNodeCount; index += 1) {
        petRecentNodeAdds.push(now);
      }
      petRecentNodeAdds = petRecentNodeAdds.filter((time) => now - time <= 5000);
      refreshPetEmotion();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: plan }));
    renderHome();
  }

  function ensureStoredPlan() {
    if (!localStorage.getItem(STORAGE_KEY)) savePlan();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function pickColor(type) {
    const colors = NODE_TYPES[type].colors;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function estimateNodeSize(node) {
    return {
      width: Math.min(220, Math.max(104, node.title.length * 16 + 52)),
      height: 52,
    };
  }

  function getNodeSize(node) {
    return nodeSizes[node.id] || estimateNodeSize(node);
  }

  function getCenter(node) {
    const size = getNodeSize(node);
    return { x: node.x + size.width / 2, y: node.y + size.height / 2 };
  }

  function makeBezier(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const bend = Math.min(130, Math.max(42, distance * 0.22));
    const direction = source.x <= target.x ? 1 : -1;
    const c1 = { x: source.x + dx * 0.34 + normalX * bend * direction, y: source.y + dy * 0.34 + normalY * bend * direction };
    const c2 = { x: source.x + dx * 0.66 - normalX * bend * 0.45 * direction, y: source.y + dy * 0.66 - normalY * bend * 0.45 * direction };
    return `M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${target.x.toFixed(1)} ${target.y.toFixed(1)}`;
  }

  function edgePath(edge) {
    const source = plan.nodes.find((node) => node.id === edge.sourceId);
    const target = plan.nodes.find((node) => node.id === edge.targetId);
    if (!source || !target) return "";
    return makeBezier(getCenter(source), getCenter(target));
  }

  function createNode(type, x, y) {
    const node = {
      id: makeId("node"),
      type,
      title: NODE_TYPES[type].title,
      x,
      y,
      color: pickColor(type),
    };
    plan.nodes.push(node);
    savePlan();
    renderBoard();
  }

  function addEdge(sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const exists = plan.edges.some(
      (edge) =>
        (edge.sourceId === sourceId && edge.targetId === targetId) ||
        (edge.sourceId === targetId && edge.targetId === sourceId),
    );
    if (!exists) {
      plan.edges.push({ id: makeId("edge"), sourceId, targetId });
      savePlan();
    }
    linkSourceId = null;
    renderBoard();
  }

  function deleteNode(nodeId) {
    plan.nodes = plan.nodes.filter((node) => node.id !== nodeId);
    plan.edges = plan.edges.filter((edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId);
    plan.notes = plan.notes.filter((note) => note.nodeId !== nodeId);
    savePlan();
    renderBoard();
  }

  function deleteEdge(edgeId) {
    plan.edges = plan.edges.filter((edge) => edge.id !== edgeId);
    savePlan();
    renderBoard();
  }

  function noteForNode(nodeId) {
    return plan.notes.find((note) => note.nodeId === nodeId);
  }

  function readCustomPolicies() {
    try {
      const raw = localStorage.getItem(POLICY_CUSTOM_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((policy) => policy?.id && policy?.title).map((policy) => ({ ...policy, custom: true }));
    } catch (error) {
      return [];
    }
  }

  function writeCustomPolicies(policies) {
    localStorage.setItem(POLICY_CUSTOM_STORAGE_KEY, JSON.stringify(policies));
  }

  function allPolicies() {
    return [...POLICY_LIBRARY, ...readCustomPolicies()];
  }

  function inferMajorId(title = "", catalogId = "") {
    if (catalogId?.startsWith("major:")) return catalogId.slice("major:".length);
    const normalized = String(title).toLowerCase();
    const aliases = [
      ["accounting", ["会计", "财务"]],
      ["economics", ["经济"]],
      ["finance", ["金融"]],
      ["law", ["法学", "法律", "法务"]],
      ["medicine", ["医学", "临床", "医生", "医疗"]],
      ["electrical-engineering", ["电气", "电力", "自动化"]],
      ["computer-science", ["计算机", "软件", "数据", "算法", "后端", "前端", "架构"]],
      ["mechanical-robotics", ["机械", "机器人", "智能制造"]],
      ["materials", ["材料", "新材料"]],
      ["microelectronics", ["微电子", "集成电路", "芯片", "半导体"]],
      ["electronic-information", ["电子信息", "通信", "光电", "射频"]],
    ];
    return aliases.find(([, words]) => words.some((word) => normalized.includes(word)))?.[0] || "";
  }

  function policyMatchesMajor(policy, majorId, majorTitle) {
    if (!policy || !Array.isArray(policy.relatedMajorIds)) return false;
    if (policy.relatedMajorIds.includes("all") || policy.relatedMajorIds.includes(majorId)) return true;
    const inferred = inferMajorId(majorTitle);
    return Boolean(inferred && policy.relatedMajorIds.includes(inferred));
  }

  function policyContextForNode(node) {
    const majorId = inferMajorId(node?.title, node?.catalogId);
    return { majorId, majorTitle: node?.title || "当前专业" };
  }

  function openPolicyPanel(majorId, majorTitle, tab = "national") {
    policyPanelOpen = true;
    policyPanelMajorId = majorId || inferMajorId(majorTitle);
    policyPanelMajorTitle = majorTitle || "当前专业";
    policyPanelTab = tab;
    expandedPolicyId = null;
    renderBoard();
  }

  function closePolicyPanel() {
    policyPanelOpen = false;
    expandedPolicyId = null;
    renderBoard();
  }

  function policiesForCurrentPanel(type) {
    return allPolicies()
      .filter((policy) => policy.type === type && policyMatchesMajor(policy, policyPanelMajorId, policyPanelMajorTitle))
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  }

  function renderPolicyCards(type) {
    const policies = policiesForCurrentPanel(type);
    if (!policies.length) {
      return `<p class="career-policy-empty">暂无匹配政策线索，可在“联网速查”里检索并添加到本地剪报。</p>`;
    }
    return policies
      .map((policy) => {
        const expanded = expandedPolicyId === policy.id;
        return `
          <article class="career-policy-card ${policy.custom ? "is-custom" : ""}">
            <div class="career-policy-card-head">
              <div>
                <p>${policy.type === "local" ? escapeHtml(policy.province || "地方") : "国家政策"} · ${escapeHtml(policy.date || "待补充")}</p>
                <h4>${escapeHtml(policy.title)}</h4>
              </div>
              <button type="button" data-policy-expand="${escapeHtml(policy.id)}" aria-label="查看详情">${expanded ? "⌃" : "⌄"}</button>
            </div>
            <p class="career-policy-summary">${escapeHtml(policy.summary || "暂无摘要")}</p>
            ${
              expanded
                ? `<div class="career-policy-detail">
                    <p>关联专业：${escapeHtml(policyPanelMajorTitle)}</p>
                    ${policy.link ? `<a href="${escapeHtml(policy.link)}" target="_blank" rel="noopener noreferrer">打开政策线索</a>` : ""}
                  </div>`
                : ""
            }
            <div class="career-policy-actions">
              <button type="button" data-policy-pin="${escapeHtml(policy.id)}">📌 钉到黑板</button>
              ${policy.custom ? `<button type="button" class="is-danger" data-policy-delete="${escapeHtml(policy.id)}">删除剪报</button>` : ""}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderPolicyPanel() {
    if (!policyPanelOpen) return "";
    const searchText = policyPanelMajorTitle || "专业";
    const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(`${searchText} 国家政策 2026`)}`;
    const govUrl = `https://www.gov.cn/search/?t=zhengce&q=${encodeURIComponent(`${searchText} 人才 政策`)}`;
    return `
      <aside class="career-policy-panel" aria-label="专业政策速查">
        <div class="career-policy-head">
          <div>
            <p>Policy Radar</p>
            <h3>${escapeHtml(policyPanelMajorTitle)}</h3>
          </div>
          <button type="button" id="closePolicyPanel" aria-label="关闭政策面板">×</button>
        </div>
        <div class="career-policy-tabs" role="tablist">
          ${[
            ["national", "🏛️ 国家政策"],
            ["local", "📍 地方政策"],
            ["search", "🔍 联网速查"],
          ]
            .map(([id, label]) => `<button type="button" data-policy-tab="${id}" class="${policyPanelTab === id ? "is-active" : ""}">${label}</button>`)
            .join("")}
        </div>
        <div class="career-policy-body">
          ${policyPanelTab === "national" ? renderPolicyCards("national") : ""}
          ${policyPanelTab === "local" ? renderPolicyCards("local") : ""}
          ${
            policyPanelTab === "search"
              ? `<div class="career-policy-search">
                  <label>速查关键词<input id="policySearchInput" type="text" value="${escapeHtml(searchText)}"></label>
                  <div class="career-policy-search-actions">
                    <a id="policyBaiduLink" href="${baiduUrl}" target="_blank" rel="noopener noreferrer">百度一下</a>
                    <a id="policyGovLink" href="${govUrl}" target="_blank" rel="noopener noreferrer">政府官网搜索</a>
                  </div>
                  <form class="career-policy-form" id="customPolicyForm">
                    <p>添加本地政策剪报</p>
                    <input name="title" required placeholder="政策标题">
                    <textarea name="summary" required placeholder="50字内摘要"></textarea>
                    <div>
                      <select name="type">
                        <option value="national">国家政策</option>
                        <option value="local">地方政策</option>
                      </select>
                      <input name="province" placeholder="省份（地方政策）">
                    </div>
                    <input name="link" placeholder="原文链接（可选）">
                    <button type="submit">保存到本地政策库</button>
                  </form>
                </div>`
              : ""
          }
        </div>
      </aside>
    `;
  }

  function findMajorNodeForPolicy(majorId, majorTitle) {
    return plan.nodes.find((node) => node.type === "major" && inferMajorId(node.title, node.catalogId) === majorId) ||
      plan.nodes.find((node) => node.type === "major" && node.title === majorTitle);
  }

  function ensureMajorNodeForPolicy(majorId, majorTitle) {
    const existing = findMajorNodeForPolicy(majorId, majorTitle);
    if (existing) return existing;
    const position = getCatalogPosition("major");
    const node = {
      id: makeId("node"),
      type: "major",
      title: majorTitle || "政策关联专业",
      x: position.x,
      y: position.y,
      color: pickColor("major"),
      catalogId: majorId ? `major:${majorId}` : "",
    };
    plan.nodes.push(node);
    return node;
  }

  function pinPolicyToBoard(policyId) {
    const policy = allPolicies().find((item) => item.id === policyId);
    if (!policy) return;
    const major = ensureMajorNodeForPolicy(policyPanelMajorId, policyPanelMajorTitle);
    let policyNode = plan.nodes.find((node) => node.type === "policy-note" && node.policyId === policy.id && node.relatedMajorId === policyPanelMajorId);
    if (!policyNode) {
      const position = getCatalogPosition("position");
      policyNode = {
        id: makeId("policy"),
        type: "policy-note",
        title: `政策：${policy.title}`,
        x: Math.min(position.x + 80, (document.getElementById("careerBoardCanvas")?.clientWidth || 1000) - 260),
        y: position.y + 30,
        color: "rgba(251, 191, 36, 0.28)",
        policyId: policy.id,
        relatedMajorId: policyPanelMajorId,
        policySummary: policy.summary,
      };
      plan.nodes.push(policyNode);
    }
    const exists = plan.edges.some((edge) => edge.sourceId === major.id && edge.targetId === policyNode.id);
    if (!exists) {
      plan.edges.push({ id: makeId("edge"), sourceId: major.id, targetId: policyNode.id, policy: true });
    }
    savePlan();
    renderBoard();
  }

  function deleteCustomPolicy(policyId) {
    const customPolicies = readCustomPolicies().filter((policy) => policy.id !== policyId);
    writeCustomPolicies(customPolicies);
    expandedPolicyId = null;
    renderBoard();
  }

  function saveCustomPolicy(form) {
    const formData = new FormData(form);
    const type = formData.get("type") === "local" ? "local" : "national";
    const policy = {
      id: makeId("custom_policy"),
      title: String(formData.get("title") || "").trim(),
      type,
      province: String(formData.get("province") || "").trim(),
      date: new Date().toISOString().slice(0, 10),
      summary: String(formData.get("summary") || "").trim(),
      link: String(formData.get("link") || "").trim(),
      relatedMajorIds: [policyPanelMajorId || inferMajorId(policyPanelMajorTitle)],
      custom: true,
    };
    if (!policy.title || !policy.summary) return;
    const nextPolicies = [...readCustomPolicies(), policy];
    writeCustomPolicies(nextPolicies);
    policyPanelTab = type;
    expandedPolicyId = policy.id;
    renderBoard();
  }

  function boardMajorContexts() {
    const contexts = plan.nodes
      .filter((node) => node.type === "major")
      .map((node) => ({ node, ...policyContextForNode(node) }))
      .filter((context) => context.majorId || context.majorTitle);
    const seen = new Set();
    return contexts.filter((context) => {
      const key = context.majorId || context.majorTitle;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function policyRadarItems() {
    const items = [];
    const policies = allPolicies();
    boardMajorContexts().forEach((context) => {
      policies
        .filter((policy) => policyMatchesMajor(policy, context.majorId, context.majorTitle))
        .forEach((policy) => items.push({ policy, majorId: context.majorId, majorTitle: context.majorTitle }));
    });
    const seen = new Set();
    return items.filter((item) => {
      const key = `${item.policy.id}:${item.majorId || item.majorTitle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderPolicyRadar() {
    if (policyPanelOpen) return "";
    const items = policyRadarItems();
    if (!items.length) return "";
    const item = items[policyRadarIndex % items.length];
    return `
      <button type="button" class="career-policy-radar" data-policy-radar-major="${escapeHtml(item.majorId || "")}" data-policy-radar-title="${escapeHtml(item.majorTitle)}">
        <span>政策雷达</span>
        <strong>${escapeHtml(item.policy.title)}</strong>
        <small>${escapeHtml(item.majorTitle)} · ${escapeHtml(item.policy.summary)}</small>
      </button>
    `;
  }

  function startPolicyRadarTimer() {
    if (policyRadarTimer) return;
    policyRadarTimer = window.setInterval(() => {
      if (!isBoardOpen || policyPanelOpen || activeNoteNodeId || draggingNode || draggingTool) return;
      const items = policyRadarItems();
      if (items.length <= 1) return;
      policyRadarIndex = (policyRadarIndex + 1) % items.length;
      renderBoard();
    }, 3000);
  }

  function stopPolicyRadarTimer() {
    if (!policyRadarTimer) return;
    window.clearInterval(policyRadarTimer);
    policyRadarTimer = null;
  }

  function buildCatalog() {
    const sections = Array.from(document.querySelectorAll(".major-section"));
    const items = [];
    sections.forEach((section, majorIndex) => {
      const majorName = section.querySelector(".section-head h2")?.textContent?.trim();
      if (!majorName) return;
      const majorId = `major:${section.id || majorIndex}`;
      items.push({ id: majorId, label: majorName, type: "major", parentId: null, order: majorIndex });

      const trackSection = Array.from(section.querySelectorAll("section[aria-label]")).find((item) =>
        item.getAttribute("aria-label")?.endsWith("晋升赛道"),
      );
      const trackCards = trackSection ? Array.from(trackSection.querySelectorAll(".track-card")) : [];
      trackCards.forEach((card, trackIndex) => {
        const trackTitle = card.querySelector(".track-title")?.textContent?.trim();
        if (!trackTitle) return;
        const trackId = `career:${section.id || majorIndex}:${trackIndex}`;
        items.push({ id: trackId, label: trackTitle, type: "career", parentId: majorId, order: trackIndex });

        Array.from(card.querySelectorAll(".ladder li")).forEach((step, stepIndex) => {
          const stepTitle = step.textContent?.trim();
          if (!stepTitle) return;
          items.push({
            id: `position:${section.id || majorIndex}:${trackIndex}:${stepIndex}`,
            label: stepTitle,
            type: "position",
            parentId: trackId,
            order: stepIndex,
          });
        });
      });
    });

    if (!catalogInitialized && items.length) {
      items.filter((item) => item.type === "major").forEach((item) => catalogExpandedIds.add(item.id));
      catalogInitialized = true;
    }
    return items;
  }

  function catalogMap(catalog) {
    return new Map(catalog.map((item) => [item.id, item]));
  }

  function catalogChildren(catalog, parentId) {
    return catalog.filter((item) => item.parentId === parentId).sort((a, b) => a.order - b.order);
  }

  function catalogAncestors(item, catalog) {
    const byId = catalogMap(catalog);
    const ancestors = [];
    let current = item;
    while (current?.parentId) {
      current = byId.get(current.parentId);
      if (current) ancestors.unshift(current);
    }
    return ancestors;
  }

  function catalogDescendants(item, catalog) {
    const children = catalogChildren(catalog, item.id);
    return children.flatMap((child) => [child, ...catalogDescendants(child, catalog)]);
  }

  function planNodeForCatalog(item) {
    return plan.nodes.find((node) => node.catalogId === item.id) || plan.nodes.find((node) => node.type === item.type && node.title === item.label);
  }

  function isCatalogItemOnBoard(item) {
    return Boolean(planNodeForCatalog(item));
  }

  function getCatalogPosition(type) {
    const board = document.getElementById("careerBoardCanvas");
    const width = board?.clientWidth || window.innerWidth || 1000;
    const height = board?.clientHeight || Math.max(window.innerHeight - 64, 620);
    const leftSafe = catalogPanelCollapsed ? 120 : 390;
    const columns = {
      major: Math.min(Math.max(leftSafe, 190), Math.max(width - 260, 190)),
      career: Math.min(Math.max(width * 0.48, leftSafe + 210), Math.max(width - 260, leftSafe + 210)),
      position: Math.min(Math.max(width * 0.72, leftSafe + 420), Math.max(width - 240, leftSafe + 420)),
    };
    const sameTypeCount = plan.nodes.filter((node) => node.type === type).length;
    const availableHeight = Math.max(180, height - 180);
    return {
      x: columns[type] + (Math.random() - 0.5) * 46,
      y: 96 + ((sameTypeCount * 78) % availableHeight) + (Math.random() - 0.5) * 26,
    };
  }

  function ensureCatalogNode(item) {
    const existing = planNodeForCatalog(item);
    if (existing) {
      if (!existing.catalogId) existing.catalogId = item.id;
      return existing;
    }
    const position = getCatalogPosition(item.type);
    const node = {
      id: makeId("node"),
      type: item.type,
      title: item.label,
      x: position.x,
      y: position.y,
      color: pickColor(item.type),
      catalogId: item.id,
    };
    plan.nodes.push(node);
    return node;
  }

  function addDependencyEdge(sourceItem, targetItem) {
    const source = planNodeForCatalog(sourceItem);
    const target = planNodeForCatalog(targetItem);
    if (!source || !target) return;
    const exists = plan.edges.some(
      (edge) =>
        (edge.sourceId === source.id && edge.targetId === target.id) ||
        (edge.sourceId === target.id && edge.targetId === source.id),
    );
    if (!exists) {
      plan.edges.push({ id: makeId("edge"), sourceId: source.id, targetId: target.id, dependency: true });
    }
  }

  function importCatalogItem(catalogId) {
    const catalog = buildCatalog();
    const item = catalog.find((entry) => entry.id === catalogId);
    if (!item) return;
    const ancestors = catalogAncestors(item, catalog);
    ancestors.forEach(ensureCatalogNode);
    ensureCatalogNode(item);
    [...ancestors, item].forEach((entry) => {
      if (entry.parentId) {
        const parent = catalog.find((candidate) => candidate.id === entry.parentId);
        if (parent) addDependencyEdge(parent, entry);
      }
    });
    savePlan();
    renderBoard();
  }

  function removeCatalogItem(catalogId) {
    const catalog = buildCatalog();
    const item = catalog.find((entry) => entry.id === catalogId);
    if (!item) return;
    const descendants = catalogDescendants(item, catalog);
    const activeDescendants = descendants.filter(isCatalogItemOnBoard);
    if (activeDescendants.length && item.type === "major") {
      const confirmed = window.confirm(`该专业下已有 ${activeDescendants.length} 个赛道/岗位在黑板上，是否一起删除？`);
      if (!confirmed) {
        renderBoard();
        return;
      }
    }
    const targets = item.type === "position" ? [item] : [item, ...activeDescendants];
    const targetIds = targets.map(planNodeForCatalog).filter(Boolean).map((node) => node.id);
    plan.nodes = plan.nodes.filter((node) => !targetIds.includes(node.id));
    plan.edges = plan.edges.filter((edge) => !targetIds.includes(edge.sourceId) && !targetIds.includes(edge.targetId));
    plan.notes = plan.notes.filter((note) => !targetIds.includes(note.nodeId));
    savePlan();
    renderBoard();
  }

  function catalogMatchesSearch(item, catalog, query) {
    if (!query) return true;
    const text = `${item.label} ${item.type}`.toLowerCase();
    if (text.includes(query)) return true;
    return catalogDescendants(item, catalog).some((child) => `${child.label} ${child.type}`.toLowerCase().includes(query));
  }

  function renderCatalogNode(item, catalog, depth = 0) {
    const query = catalogSearchQuery.trim().toLowerCase();
    if (!catalogMatchesSearch(item, catalog, query)) return "";
    const children = catalogChildren(catalog, item.id);
    const visibleChildren = children.map((child) => renderCatalogNode(child, catalog, depth + 1)).join("");
    const hasChildren = children.length > 0;
    const isExpanded = catalogExpandedIds.has(item.id) || Boolean(query);
    const onBoard = isCatalogItemOnBoard(item);
    const childOnBoardCount = children.filter(isCatalogItemOnBoard).length;
    const labelClass = onBoard ? "is-on-board" : "";
    return `
      <div class="career-tree-node" data-catalog-id="${escapeHtml(item.id)}" data-depth="${depth}">
        <div class="career-tree-row ${onBoard ? "is-on-board" : ""}" style="--tree-depth:${depth};">
          <button type="button" class="career-tree-expand ${hasChildren ? "" : "is-hidden"} ${isExpanded ? "is-expanded" : ""}" data-expand-catalog="${escapeHtml(item.id)}" aria-label="展开或收起">▶</button>
          <input class="career-tree-check" type="checkbox" data-check-catalog="${escapeHtml(item.id)}" ${onBoard ? "checked" : ""} aria-label="导入 ${escapeHtml(item.label)}">
          <span class="career-tree-label ${labelClass}" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
          <span class="career-tree-status" aria-hidden="true"></span>
          ${hasChildren ? `<span class="career-tree-badge">${childOnBoardCount}/${children.length}</span>` : ""}
          ${item.type === "major" ? `<button type="button" class="career-tree-policy" data-policy-catalog="${escapeHtml(item.id)}" data-policy-title="${escapeHtml(item.label)}" aria-label="查看${escapeHtml(item.label)}政策">📜</button>` : '<span class="career-tree-policy-spacer"></span>'}
        </div>
        ${hasChildren ? `<div class="career-tree-children ${isExpanded ? "is-expanded" : "is-collapsed"}">${visibleChildren}</div>` : ""}
      </div>
    `;
  }

  function renderCatalogPanel() {
    const catalog = buildCatalog();
    const roots = catalogChildren(catalog, null);
    return `
      <aside class="career-catalog-panel ${catalogPanelCollapsed ? "is-collapsed" : ""}" aria-label="职业规划目录导入">
        <button type="button" class="career-catalog-toggle" id="careerCatalogToggle" aria-label="${catalogPanelCollapsed ? "展开目录" : "收起目录"}">${catalogPanelCollapsed ? "▶" : "◀"}</button>
        <div class="career-catalog-inner">
          <div class="career-catalog-head">
            <div>
              <p>Career Catalog</p>
              <h3>规划目录</h3>
            </div>
            <span>${plan.nodes.length} 节点</span>
          </div>
          <input id="careerCatalogSearch" class="career-catalog-search" type="search" value="${escapeHtml(catalogSearchQuery)}" placeholder="搜索专业 / 赛道 / 岗位">
          <div class="career-catalog-hint">勾选目录项会自动导入上游节点，并生成依赖链连线。</div>
          <div class="career-catalog-tree">
            ${roots.length ? roots.map((item) => renderCatalogNode(item, catalog)).join("") : '<p class="career-catalog-empty">暂无可导入目录</p>'}
          </div>
        </div>
      </aside>
    `;
  }

  function calendarDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function calendarDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function calendarEvents() {
    const events = {};
    plan.notes.forEach((note) => {
      if (note.planDate) {
        events[note.planDate] ||= { plan: [], complete: [] };
        events[note.planDate].plan.push(note.nodeId);
      }
      if (note.completeDate) {
        events[note.completeDate] ||= { plan: [], complete: [] };
        events[note.completeDate].complete.push(note.nodeId);
      }
    });
    return events;
  }

  function nodesForCalendarDate(dateKey) {
    const results = [];
    plan.notes.forEach((note) => {
      if (note.planDate !== dateKey && note.completeDate !== dateKey) return;
      const node = plan.nodes.find((item) => item.id === note.nodeId);
      if (!node) return;
      const types = [];
      if (note.planDate === dateKey) types.push("规划");
      if (note.completeDate === dateKey) types.push("完成");
      results.push({ node, note, types });
    });
    return results;
  }

  function nodeHasActiveCalendarDate(nodeId) {
    if (!calendarActiveDate) return false;
    return plan.notes.some((note) => note.nodeId === nodeId && (note.planDate === calendarActiveDate || note.completeDate === calendarActiveDate));
  }

  function renderCalendarSelectedList() {
    if (!calendarActiveDate) {
      return '<p class="career-calendar-empty">点击带圆点日期，高亮对应规划泡泡。</p>';
    }
    const entries = nodesForCalendarDate(calendarActiveDate);
    if (!entries.length) {
      return `<p class="career-calendar-empty">${calendarActiveDate} 暂无规划节点</p>`;
    }
    return `
      <div class="career-calendar-list">
        <p>${calendarActiveDate}</p>
        ${entries
          .map(
            ({ node, types }) => `
              <button type="button" class="career-calendar-node" data-calendar-node="${node.id}">
                <span>${escapeHtml(types.join(" / "))}</span>
                <strong>${escapeHtml(node.title)}</strong>
              </button>`,
          )
          .join("")}
      </div>
    `;
  }

  function renderCalendarWidget() {
    const events = calendarEvents();
    const today = calendarDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const monthLabel = `${calendarYear}年${calendarMonth + 1}月`;
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = calendarDaysInMonth(calendarYear, calendarMonth);
    const prevMonthDays = calendarDaysInMonth(calendarYear, calendarMonth - 1);
    const dayCells = [];

    for (let index = firstDay - 1; index >= 0; index -= 1) {
      const day = prevMonthDays - index;
      const dateKey = calendarDateKey(calendarMonth === 0 ? calendarYear - 1 : calendarYear, calendarMonth === 0 ? 11 : calendarMonth - 1, day);
      dayCells.push({ day, dateKey, otherMonth: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      dayCells.push({ day, dateKey: calendarDateKey(calendarYear, calendarMonth, day), otherMonth: false });
    }

    while (dayCells.length % 7 !== 0) {
      const day = dayCells.length - firstDay - daysInMonth + 1;
      const dateKey = calendarDateKey(calendarMonth === 11 ? calendarYear + 1 : calendarYear, calendarMonth === 11 ? 0 : calendarMonth + 1, day);
      dayCells.push({ day, dateKey, otherMonth: true });
    }

    return `
      <button type="button" id="careerCalendarToggle" class="career-calendar-toggle ${calendarVisible ? "" : "is-visible"}" title="展开里程碑日历">📅</button>
      <aside class="career-calendar-widget ${calendarVisible ? "" : "is-hidden"}" aria-label="里程碑日历">
        <div class="career-calendar-head">
          <button type="button" data-calendar-nav="prev" aria-label="上个月">◀</button>
          <button type="button" class="career-calendar-title" id="careerCalendarTitle" title="双击折叠日历">${monthLabel}</button>
          <button type="button" data-calendar-nav="next" aria-label="下个月">▶</button>
          <button type="button" class="career-calendar-minimize" data-calendar-minimize aria-label="折叠日历">×</button>
        </div>
        <div class="career-calendar-weekdays">
          <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
        </div>
        <div class="career-calendar-days">
          ${dayCells
            .map(({ day, dateKey, otherMonth }) => {
              const event = events[dateKey];
              const hasPlan = Boolean(event?.plan.length);
              const hasComplete = Boolean(event?.complete.length);
              const classes = [
                "career-calendar-day",
                otherMonth ? "is-other-month" : "",
                dateKey === today ? "is-today" : "",
                hasPlan || hasComplete ? "has-event" : "",
                hasPlan && !hasComplete ? "has-plan" : "",
                hasComplete && !hasPlan ? "has-complete" : "",
                hasPlan && hasComplete ? "has-both" : "",
                dateKey === calendarActiveDate ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return `<button type="button" class="${classes}" data-calendar-date="${dateKey}">${day}</button>`;
            })
            .join("")}
        </div>
        <div class="career-calendar-legend">
          <span><i class="is-plan"></i>规划</span>
          <span><i class="is-complete"></i>完成</span>
          <span><i class="is-both"></i>两者</span>
        </div>
        ${renderCalendarSelectedList()}
      </aside>
    `;
  }

  function calculateProgress(planDate, completeDate) {
    if (!planDate) return null;
    const now = new Date();
    const planStart = new Date(planDate);
    if (Number.isNaN(planStart.getTime())) return null;
    const completeTarget = completeDate ? new Date(completeDate) : new Date(planStart.getTime() + 365 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(completeTarget.getTime())) return null;
    if (now < planStart) return 0;
    if (now > completeTarget) return 1;
    const total = completeTarget.getTime() - planStart.getTime();
    if (total <= 0) return 1;
    return Math.min(Math.max((now.getTime() - planStart.getTime()) / total, 0), 1);
  }

  function progressColor(progress) {
    if (progress < 0.3) return "#4fc3f7";
    if (progress < 0.7) return "#81c784";
    return "#ffb74d";
  }

  function renderProgressRing(note, size = 52, strokeWidth = 3) {
    const progress = calculateProgress(note?.planDate, note?.completeDate);
    if (progress === null) return "";
    const color = progressColor(progress);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress);
    return `
      <div class="career-progress-ring" style="width:${size}px; height:${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="${strokeWidth}"></circle>
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}" style="filter: drop-shadow(0 0 4px ${color});"></circle>
        </svg>
        <span>${Math.round(progress * 100)}%</span>
      </div>
    `;
  }

  function calculateStats() {
    const now = new Date();
    const connectedNodeIds = new Set();
    plan.edges.forEach((edge) => {
      connectedNodeIds.add(edge.sourceId);
      connectedNodeIds.add(edge.targetId);
    });
    const completed = plan.notes.filter((note) => note.completeDate && new Date(note.completeDate) < now).length;
    const inProgress = plan.notes.filter((note) => {
      if (!note.planDate) return false;
      const planStart = new Date(note.planDate);
      if (Number.isNaN(planStart.getTime()) || planStart > now) return false;
      return !(note.completeDate && new Date(note.completeDate) < now);
    }).length;
    return {
      totalNodes: plan.nodes.length,
      totalEdges: plan.edges.length,
      completed,
      inProgress,
      connectedCount: connectedNodeIds.size,
      completionRate: plan.nodes.length > 0 ? Math.round((completed / plan.nodes.length) * 100) : 0,
    };
  }

  function renderStatsBoard(stats) {
    const cards = [
      { label: "总节点", value: stats.totalNodes, icon: "📌" },
      { label: "总连线", value: stats.totalEdges, icon: "🧵" },
      { label: "已完成", value: stats.completed, icon: "✅" },
      { label: "进行中", value: stats.inProgress, icon: "🔄" },
      { label: "完成率", value: `${stats.completionRate}%`, icon: "📊" },
      { label: "路径节点", value: stats.connectedCount, icon: "🌐" },
    ];
    const motivation =
      stats.completionRate === 100 && stats.totalNodes > 0
        ? "🎉 恭喜你完成所有规划！继续加油！"
        : stats.completionRate > 0
          ? `💪 已完成 ${stats.completed}/${stats.totalNodes} 个目标，继续前进！`
          : stats.totalNodes > 0
            ? "🌟 规划已就绪，开始行动吧！"
            : "";

    return `
      <div class="career-board-stats-panel" aria-label="职业规划统计看板">
        <div class="career-board-stats-grid">
          ${cards
            .map(
              (card) => `
                <div class="career-stat-card">
                  <span>${card.icon}</span>
                  <strong>${card.value}</strong>
                  <small>${card.label}</small>
                </div>`,
            )
            .join("")}
        </div>
        ${motivation ? `<p class="career-board-motivation">${motivation}</p>` : ""}
      </div>
    `;
  }

  function renderThemeSelector() {
    return `
      <div class="career-theme-selector">
        <button type="button" id="careerThemeToggle" class="career-theme-toggle" aria-expanded="${themeMenuOpen ? "true" : "false"}">
          <span>🎨</span>
          <strong>${currentTheme.name}</strong>
          <small>${themeMenuOpen ? "▲" : "▼"}</small>
        </button>
        ${
          themeMenuOpen
            ? `<div class="career-theme-menu">
                ${THEMES.map(
                  (theme) => `
                    <button type="button" data-career-theme="${theme.id}" class="${currentTheme.id === theme.id ? "is-active" : ""}">
                      <span style="background:${theme.bgColor};"></span>
                      ${theme.name}
                    </button>`,
                ).join("")}
              </div>`
            : ""
        }
      </div>
    `;
  }

  function renderThumbnail(width = 300, height = 200) {
    const nodes = plan.nodes;
    const padding = 26;
    let minX = 0;
    let minY = 0;
    let maxX = 1000;
    let maxY = 640;

    if (nodes.length) {
      minX = Math.min(...nodes.map((node) => node.x));
      minY = Math.min(...nodes.map((node) => node.y));
      maxX = Math.max(...nodes.map((node) => node.x + estimateNodeSize(node).width));
      maxY = Math.max(...nodes.map((node) => node.y + estimateNodeSize(node).height));
    }

    const planWidth = Math.max(maxX - minX, 1);
    const planHeight = Math.max(maxY - minY, 1);
    const scale = Math.min((width - padding * 2) / planWidth, (height - padding * 2) / planHeight, 0.42);
    const offsetX = (width - planWidth * scale) / 2 - minX * scale;
    const offsetY = (height - planHeight * scale) / 2 - minY * scale;
    const thumbNodes = nodes.map((node) => {
      const size = estimateNodeSize(node);
      return {
        ...node,
        x: node.x * scale + offsetX,
        y: node.y * scale + offsetY,
        width: size.width * scale,
        height: size.height * scale,
      };
    });

    const thumbCenter = (node) => ({ x: node.x + node.width / 2, y: node.y + node.height / 2 });

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="职业规划黑板缩略图">
        <defs>
          <pattern id="careerThumbDust" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="5" r="0.7" fill="rgba(255,255,255,0.12)" />
            <circle cx="14" cy="12" r="0.55" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" rx="18" fill="${currentTheme.bgColor}" />
        <rect width="${width}" height="${height}" rx="18" fill="url(#careerThumbDust)" opacity="0.85" />
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="14" fill="none" stroke="rgba(255,255,255,0.16)" />
        ${plan.edges
          .map((edge) => {
            const source = thumbNodes.find((node) => node.id === edge.sourceId);
            const target = thumbNodes.find((node) => node.id === edge.targetId);
            if (!source || !target) return "";
            return `<path d="${makeBezier(thumbCenter(source), thumbCenter(target))}" fill="none" stroke="${currentTheme.edgeColor}" stroke-dasharray="4 4" stroke-linecap="round" stroke-width="1.8" opacity="0.9" />`;
          })
          .join("")}
        ${thumbNodes
          .map((node) => {
            const title = node.title.length > 7 ? `${node.title.slice(0, 7)}…` : node.title;
            return `
              <g>
                <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${Math.min(26, node.height / 2)}" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" />
                <text x="${node.x + node.width / 2}" y="${node.y + node.height / 2 + 4}" text-anchor="middle" fill="${currentTheme.chalkColor}" font-size="${Math.max(10, 15 * scale)}" font-weight="700" font-family="Chalkboard SE, Comic Sans MS, Microsoft YaHei, cursive">${escapeHtml(title)}</text>
              </g>`;
          })
          .join("")}
      </svg>
    `;
  }

  function startPetDrag(event, element) {
    if (event.button !== 0 || event.target.closest("button") || event.target.closest("[data-pet-menu]")) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = element.getBoundingClientRect();
    petDragging = {
      id: selectedPetId,
      element,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moved: false,
    };
    element.classList.add("is-dragging");
    petClickSuppressed = false;
    document.body.style.userSelect = "none";
  }

  function bindPetEvents() {
    document.querySelectorAll("[data-pet-root]").forEach((pet) => {
      pet.addEventListener("mousedown", (event) => startPetDrag(event, pet));
      pet.addEventListener("click", (event) => {
        if (event.target.closest("button") || event.target.closest("[data-pet-menu]")) return;
        event.stopPropagation();
        if (petClickSuppressed) {
          petClickSuppressed = false;
          return;
        }
        showPetMessage();
      });
      pet.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
        pet.classList.toggle("is-menu-open");
      });
    });
    document.querySelectorAll("[data-pet-switch]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        switchToNextPet();
      });
    });
    document.querySelectorAll("[data-pet-choice]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        switchPet(button.dataset.petChoice);
      });
    });
  }

  function renderHome() {
    const root = document.getElementById("careerBlackboardHome");
    if (!root) return;
    const stats = calculateStats();
    root.innerHTML = `
      <article class="career-board-card">
        <div class="career-board-copy">
          <p class="career-board-kicker">Career Planning Board</p>
          <h2>职业规划黑板</h2>
          <p>用泡泡和毛线把“专业 → 职业 → 职位”串成自己的长期路线。数据自动保存在本机浏览器。</p>
          <div class="career-board-actions">
            <button type="button" id="openCareerBlackboard">打开黑板</button>
            <span>${plan.nodes.length} 个节点 · ${plan.edges.length} 条连线 · ${plan.notes.length} 条备注</span>
          </div>
        </div>
        <div class="career-board-home-side">
          <div class="career-board-thumb" title="${plan.nodes.length} 个节点 · ${plan.edges.length} 条连线">
            ${renderThumbnail(300, 200)}
          </div>
          ${renderStatsBoard(stats)}
        </div>
      </article>
      ${!isBoardOpen ? renderDesktopPet("home") : ""}
    `;
    document.getElementById("openCareerBlackboard")?.addEventListener("click", openBoard);
    bindPetEvents();
  }

  function renderBoard() {
    if (!isBoardOpen) return;
    const overlay = document.getElementById("careerBlackboardOverlay");
    if (!overlay) return;

    overlay.hidden = false;
    overlay.innerHTML = `
      <div class="career-board-full" style="--board-bg:${currentTheme.bgColor}; --chalk-color:${currentTheme.chalkColor}; --node-bg:${currentTheme.nodeBg}; --edge-color:${currentTheme.edgeColor};">
        <header class="career-board-top">
          <div>
            <h2>职业规划黑板</h2>
            <p>点击泡泡池生成节点，按图钉连线，右键删除，双击改名。</p>
          </div>
          <div class="career-board-stats">
            <span>${plan.nodes.length} 个泡泡</span>
            <span>${plan.edges.length} 条毛线</span>
            <button type="button" id="closeCareerBlackboard">退出 / 返回首页</button>
          </div>
        </header>
        <main class="career-board-canvas" id="careerBoardCanvas">
          ${renderThemeSelector()}
          ${renderCalendarWidget()}
          ${renderCatalogPanel()}
          ${renderPolicyPanel()}
          <div class="career-board-tools">
            <p>泡泡池</p>
            ${Object.entries(NODE_TYPES)
              .map(
                ([type, info]) => `
                <button type="button" class="career-tool" data-tool-type="${type}">
                  <strong>${info.label}</strong>
                  <span>${type === "major" ? "学习起点" : type === "career" ? "发展方向" : "阶段目标"}</span>
                </button>`,
              )
              .join("")}
          </div>
          <svg class="career-board-lines">
            <defs>
              <filter id="careerThreadRoughen">
                <feTurbulence baseFrequency="0.9" numOctaves="2" seed="8" type="fractalNoise"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="0.75"></feDisplacementMap>
              </filter>
            </defs>
            ${plan.edges
              .map((edge) => {
                const path = edgePath(edge);
                if (!path) return "";
                const dash = edge.policy ? "7 5" : edge.dependency ? "10 7" : "4 5";
                const width = edge.policy ? 3.4 : edge.dependency ? 3.2 : 2.6;
                const stroke = edge.policy ? "#fbbf24" : "var(--edge-color, #ff7b54)";
                return `
                  <g>
                    <path d="${path}" fill="none" stroke="rgba(89,41,23,0.26)" stroke-linecap="round" stroke-width="9"></path>
                    <path d="${path}" fill="none" stroke="${stroke}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-width="${width}" filter="url(#careerThreadRoughen)"></path>
                    <path class="career-edge-hit" data-edge-id="${edge.id}" d="${path}" fill="none" stroke="transparent" stroke-linecap="round" stroke-width="18"></path>
                  </g>`;
              })
              .join("")}
          </svg>
          ${plan.nodes
            .map((node) => {
              const isPolicyNote = node.type === "policy-note";
              const typeInfo = NODE_TYPES[node.type] || { label: isPolicyNote ? "政策" : "节点" };
              const note = noteForNode(node.id);
              return `
                <div class="career-node ${isPolicyNote ? "is-policy-note" : ""} ${linkSourceId === node.id ? "is-linking" : ""} ${nodeHasActiveCalendarDate(node.id) ? "is-calendar-highlighted" : ""}" data-node-id="${node.id}" style="left:${node.x}px; top:${node.y}px; --node-color:${node.color};">
                  <div class="career-node-bubble">
                    ${note?.planDate ? renderProgressRing(note) : ""}
                    <span class="career-node-type">${typeInfo.label}</span>
                    <strong>${escapeHtml(node.title)}</strong>
                    ${node.type === "major" ? '<button type="button" class="career-policy-button" data-policy-node-id="' + node.id + '" aria-label="查看专业政策">📜</button>' : ""}
                    ${!isPolicyNote ? `<button type="button" class="career-pin" data-pin-id="${node.id}" aria-label="从 ${escapeHtml(node.title)} 开始连线">📌</button>` : ""}
                    ${note ? '<span class="career-note-dot" aria-label="已有备注"></span>' : ""}
                  </div>
                  ${!isPolicyNote ? `<button type="button" class="career-note-button" data-note-id="${node.id}">💬 备注</button>` : `<p class="career-policy-note-summary">${escapeHtml(node.policySummary || "政策剪报")}</p>`}
                </div>`;
            })
            .join("")}
          ${linkSourceId ? '<div class="career-link-hint">连线模式：再点击另一个泡泡生成毛线连接</div>' : ""}
          <div class="career-dependency-legend"><span></span>自动依赖链：专业 → 赛道 → 岗位</div>
          ${renderPolicyRadar()}
          ${renderDesktopPet("board")}
        </main>
      </div>
    `;

    bindBoardEvents();
    measureNodes();
    if (contextMenu) renderContextMenu();
    if (activeNoteNodeId) renderNoteModal();
  }

  function bindBoardEvents() {
    document.getElementById("closeCareerBlackboard")?.addEventListener("click", closeBoard);
    bindPetEvents();
    document.getElementById("closePolicyPanel")?.addEventListener("click", (event) => {
      event.stopPropagation();
      closePolicyPanel();
    });
    document.querySelector(".career-policy-panel")?.addEventListener("mousedown", (event) => event.stopPropagation());
    document.querySelector(".career-policy-panel")?.addEventListener("click", (event) => event.stopPropagation());
    document.querySelectorAll("[data-policy-tab]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        policyPanelTab = button.dataset.policyTab || "national";
        expandedPolicyId = null;
        renderBoard();
      });
    });
    document.querySelectorAll("[data-policy-expand]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = button.dataset.policyExpand;
        expandedPolicyId = expandedPolicyId === id ? null : id;
        renderBoard();
      });
    });
    document.querySelectorAll("[data-policy-pin]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        pinPolicyToBoard(button.dataset.policyPin);
      });
    });
    document.querySelectorAll("[data-policy-delete]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteCustomPolicy(button.dataset.policyDelete);
      });
    });
    document.getElementById("policySearchInput")?.addEventListener("input", (event) => {
      const value = event.target.value || policyPanelMajorTitle;
      const baidu = document.getElementById("policyBaiduLink");
      const gov = document.getElementById("policyGovLink");
      if (baidu) baidu.href = `https://www.baidu.com/s?wd=${encodeURIComponent(`${value} 国家政策 2026`)}`;
      if (gov) gov.href = `https://www.gov.cn/search/?t=zhengce&q=${encodeURIComponent(`${value} 人才 政策`)}`;
    });
    document.getElementById("customPolicyForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      saveCustomPolicy(event.currentTarget);
    });
    document.querySelectorAll("[data-policy-node-id]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const node = plan.nodes.find((item) => item.id === button.dataset.policyNodeId);
        const context = policyContextForNode(node);
        openPolicyPanel(context.majorId, context.majorTitle);
      });
    });
    document.querySelectorAll("[data-policy-catalog]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const catalogId = button.dataset.policyCatalog || "";
        openPolicyPanel(catalogId.startsWith("major:") ? catalogId.slice("major:".length) : inferMajorId(button.dataset.policyTitle), button.dataset.policyTitle);
      });
    });
    document.querySelector("[data-policy-radar-major]")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const button = event.currentTarget;
      openPolicyPanel(button.dataset.policyRadarMajor || inferMajorId(button.dataset.policyRadarTitle), button.dataset.policyRadarTitle);
    });
    document.querySelector(".career-calendar-widget")?.addEventListener("mousedown", (event) => event.stopPropagation());
    document.querySelector(".career-calendar-widget")?.addEventListener("click", (event) => event.stopPropagation());
    document.getElementById("careerCalendarToggle")?.addEventListener("click", (event) => {
      event.stopPropagation();
      calendarVisible = true;
      renderBoard();
    });
    document.querySelector("[data-calendar-minimize]")?.addEventListener("click", (event) => {
      event.stopPropagation();
      calendarVisible = false;
      renderBoard();
    });
    document.getElementById("careerCalendarTitle")?.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      calendarVisible = false;
      renderBoard();
    });
    document.querySelectorAll("[data-calendar-nav]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (button.dataset.calendarNav === "prev") calendarMonth -= 1;
        if (button.dataset.calendarNav === "next") calendarMonth += 1;
        if (calendarMonth < 0) {
          calendarMonth = 11;
          calendarYear -= 1;
        }
        if (calendarMonth > 11) {
          calendarMonth = 0;
          calendarYear += 1;
        }
        renderBoard();
      });
    });
    document.querySelectorAll("[data-calendar-date]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const dateKey = button.dataset.calendarDate;
        if (!dateKey) return;
        calendarActiveDate = calendarActiveDate === dateKey ? null : dateKey;
        if (button.classList.contains("is-other-month")) {
          const selected = new Date(`${dateKey}T00:00:00`);
          if (!Number.isNaN(selected.getTime())) {
            calendarYear = selected.getFullYear();
            calendarMonth = selected.getMonth();
          }
        }
        renderBoard();
      });
    });
    document.querySelectorAll("[data-calendar-node]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const nodeId = button.dataset.calendarNode;
        if (!nodeId) return;
        calendarActiveDate = calendarActiveDate || noteForNode(nodeId)?.planDate || noteForNode(nodeId)?.completeDate || null;
        renderBoard();
      });
    });
    document.querySelector(".career-catalog-panel")?.addEventListener("mousedown", (event) => event.stopPropagation());
    document.querySelector(".career-catalog-panel")?.addEventListener("click", (event) => event.stopPropagation());
    document.getElementById("careerCatalogToggle")?.addEventListener("click", (event) => {
      event.stopPropagation();
      catalogPanelCollapsed = !catalogPanelCollapsed;
      renderBoard();
    });
    document.getElementById("careerCatalogSearch")?.addEventListener("input", (event) => {
      const cursor = event.target.selectionStart || 0;
      catalogSearchQuery = event.target.value;
      renderBoard();
      window.setTimeout(() => {
        const input = document.getElementById("careerCatalogSearch");
        input?.focus();
        input?.setSelectionRange(cursor, cursor);
      }, 0);
    });
    document.querySelectorAll("[data-expand-catalog]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = button.dataset.expandCatalog;
        if (!id) return;
        if (catalogExpandedIds.has(id)) catalogExpandedIds.delete(id);
        else catalogExpandedIds.add(id);
        renderBoard();
      });
    });
    document.querySelectorAll("[data-check-catalog]").forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => event.stopPropagation());
      checkbox.addEventListener("change", () => {
        const id = checkbox.dataset.checkCatalog;
        if (!id) return;
        if (checkbox.checked) importCatalogItem(id);
        else removeCatalogItem(id);
      });
    });
    document.querySelectorAll(".career-tree-row").forEach((row) => {
      row.addEventListener("click", (event) => {
        if (event.target.closest("button") || event.target.closest("input")) return;
        const checkbox = row.querySelector("[data-check-catalog]");
        if (!checkbox) return;
        checkbox.checked = !checkbox.checked;
        const id = checkbox.dataset.checkCatalog;
        if (!id) return;
        if (checkbox.checked) importCatalogItem(id);
        else removeCatalogItem(id);
      });
    });
    document.getElementById("careerThemeToggle")?.addEventListener("click", (event) => {
      event.stopPropagation();
      themeMenuOpen = !themeMenuOpen;
      renderBoard();
    });
    document.querySelectorAll("[data-career-theme]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        changeTheme(button.dataset.careerTheme);
      });
    });
    document.querySelectorAll(".career-tool").forEach((button) => {
      button.addEventListener("mousedown", (event) => startToolDrag(event, button.dataset.toolType));
    });
    document.querySelectorAll(".career-node").forEach((element) => {
      element.addEventListener("mousedown", (event) => startNodeDrag(event, element.dataset.nodeId));
      element.addEventListener("click", (event) => clickNode(event, element.dataset.nodeId));
      element.addEventListener("dblclick", (event) => renameNode(event, element.dataset.nodeId));
      element.addEventListener("contextmenu", (event) => showContextMenu(event, "node", element.dataset.nodeId));
    });
    document.querySelectorAll(".career-pin").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        linkSourceId = linkSourceId === button.dataset.pinId ? null : button.dataset.pinId;
        renderBoard();
      });
    });
    document.querySelectorAll(".career-note-button").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        activeNoteNodeId = button.dataset.noteId;
        renderBoard();
      });
    });
    document.querySelectorAll(".career-edge-hit").forEach((path) => {
      path.addEventListener("contextmenu", (event) => showContextMenu(event, "edge", path.dataset.edgeId));
    });
    document.getElementById("careerBoardCanvas")?.addEventListener("click", (event) => {
      if (event.target?.id === "careerBoardCanvas") {
        linkSourceId = null;
        contextMenu = null;
        renderBoard();
      }
    });
  }

  function measureNodes() {
    document.querySelectorAll(".career-node").forEach((element) => {
      const id = element.dataset.nodeId;
      if (id) nodeSizes[id] = { width: element.offsetWidth, height: element.offsetHeight };
    });
  }

  function startToolDrag(event, type) {
    event.preventDefault();
    event.stopPropagation();
    draggingTool = { type, startX: event.clientX, startY: event.clientY, moved: false };
    document.body.style.userSelect = "none";
  }

  function startNodeDrag(event, nodeId) {
    if (event.button !== 0 || linkSourceId || event.target.closest("button")) return;
    event.preventDefault();
    event.stopPropagation();
    const node = plan.nodes.find((item) => item.id === nodeId);
    const board = document.getElementById("careerBoardCanvas");
    if (!node || !board) return;
    const rect = board.getBoundingClientRect();
    draggingNode = {
      nodeId,
      offsetX: event.clientX - rect.left - node.x,
      offsetY: event.clientY - rect.top - node.y,
    };
    document.body.style.userSelect = "none";
  }

  function clickNode(event, nodeId) {
    event.stopPropagation();
    if (!linkSourceId || linkSourceId === nodeId) return;
    addEdge(linkSourceId, nodeId);
  }

  function renameNode(event, nodeId) {
    event.stopPropagation();
    const node = plan.nodes.find((item) => item.id === nodeId);
    if (!node) return;
    const title = window.prompt("修改泡泡名称", node.title)?.trim();
    if (!title || title === node.title) return;
    node.title = title;
    savePlan();
    renderBoard();
  }

  function showContextMenu(event, kind, id) {
    event.preventDefault();
    event.stopPropagation();
    contextMenu = { kind, id, x: event.clientX, y: event.clientY };
    renderBoard();
  }

  function renderContextMenu() {
    const overlay = document.getElementById("careerBlackboardOverlay");
    if (!overlay || !contextMenu) return;
    const menu = document.createElement("div");
    menu.className = "career-context-menu";
    menu.style.left = `${contextMenu.x}px`;
    menu.style.top = `${contextMenu.y}px`;
    menu.innerHTML = `<button type="button">删除${contextMenu.kind === "node" ? "泡泡" : "连线"}</button>`;
    menu.querySelector("button").addEventListener("click", () => {
      if (contextMenu.kind === "node") deleteNode(contextMenu.id);
      else deleteEdge(contextMenu.id);
      contextMenu = null;
    });
    overlay.appendChild(menu);
  }

  function renderNoteModal() {
    const overlay = document.getElementById("careerBlackboardOverlay");
    const node = plan.nodes.find((item) => item.id === activeNoteNodeId);
    if (!overlay || !node) return;
    const note = noteForNode(node.id) || { planDate: new Date().toISOString().slice(0, 10), completeDate: "", content: "" };
    const modal = document.createElement("div");
    modal.className = "career-note-modal";
    modal.innerHTML = `
      <div class="career-note-panel">
        <div class="career-note-head">
          <div><p>职业规划备注</p><h3>${escapeHtml(node.title)}</h3></div>
          <button type="button" data-close-note>×</button>
        </div>
        <label>规划时间<input type="date" id="careerPlanDate" value="${escapeHtml(note.planDate || "")}"></label>
        <label>完成时间（可选）<input type="date" id="careerCompleteDate" value="${escapeHtml(note.completeDate || "")}"></label>
        <label class="career-note-wide">备注内容<textarea id="careerNoteContent" placeholder="写下下一步行动、学习目标、证书安排或求职计划...">${escapeHtml(note.content || "")}</textarea></label>
        <div class="career-note-actions">
          <button type="button" data-close-note>取消</button>
          <button type="button" id="saveCareerNote">保存备注</button>
        </div>
      </div>
    `;
    modal.querySelectorAll("[data-close-note]").forEach((button) => {
      button.addEventListener("click", () => {
        activeNoteNodeId = null;
        renderBoard();
      });
    });
    modal.querySelector("#saveCareerNote").addEventListener("click", () => {
      const existing = noteForNode(node.id);
      const nextNote = {
        id: existing?.id || makeId("note"),
        nodeId: node.id,
        planDate: modal.querySelector("#careerPlanDate").value,
        completeDate: modal.querySelector("#careerCompleteDate").value,
        content: modal.querySelector("#careerNoteContent").value,
      };
      if (existing) Object.assign(existing, nextNote);
      else plan.notes.push(nextNote);
      activeNoteNodeId = null;
      savePlan();
      renderBoard();
    });
    overlay.appendChild(modal);
  }

  function openBoard() {
    isBoardOpen = true;
    document.body.classList.add("career-board-lock");
    startPolicyRadarTimer();
    renderHome();
    renderBoard();
  }

  function closeBoard() {
    isBoardOpen = false;
    linkSourceId = null;
    draggingNode = null;
    draggingTool = null;
    contextMenu = null;
    activeNoteNodeId = null;
    policyPanelOpen = false;
    stopPolicyRadarTimer();
    document.body.classList.remove("career-board-lock");
    const overlay = document.getElementById("careerBlackboardOverlay");
    if (overlay) {
      overlay.hidden = true;
      overlay.innerHTML = "";
    }
    renderHome();
  }

  function addStyles() {
    if (document.getElementById("careerBlackboardStyles")) return;
    const style = document.createElement("style");
    style.id = "careerBlackboardStyles";
    style.textContent = `
      .career-board-lock { overflow: hidden; }
      .career-board-section { width: min(100% - 32px, var(--content)); margin: 0 auto 22px; }
      .career-board-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 22px; align-items: center; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); box-shadow: var(--shadow); padding: 22px; }
      .career-board-kicker { margin: 0 0 6px; color: var(--accent-2); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .career-board-copy h2 { margin: 0; color: var(--text); font-size: clamp(22px, 3vw, 30px); line-height: 1.2; }
      .career-board-copy p { margin: 10px 0 0; color: var(--muted); }
      .career-board-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 18px; color: var(--muted); font-size: 13px; }
      .career-board-actions button { min-height: 40px; border: 1px solid #0b5f63; border-radius: 999px; background: #0f766e; color: #fff; padding: 0 18px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 18px rgba(15,118,110,.18); }
      .career-board-actions button:hover { background: #115e59; }
      .career-board-home-side { display: grid; gap: 12px; justify-items: stretch; width: 300px; }
      .career-board-thumb { width: 300px; height: 200px; overflow: hidden; border-radius: 18px; box-shadow: 0 18px 38px rgba(0,0,0,.18); }
      .career-board-stats-panel { display: grid; gap: 8px; }
      .career-board-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
      .career-stat-card { min-width: 0; border: 1px solid rgba(15,23,42,.08); border-radius: 14px; background: color-mix(in srgb, var(--panel) 88%, #0f766e 12%); padding: 9px 6px; text-align: center; box-shadow: inset 0 1px 0 rgba(255,255,255,.18); }
      .career-stat-card span, .career-stat-card strong, .career-stat-card small { display: block; }
      .career-stat-card span { font-size: 17px; line-height: 1; }
      .career-stat-card strong { margin-top: 4px; color: var(--text); font-size: 18px; line-height: 1; }
      .career-stat-card small { margin-top: 3px; color: var(--muted); font-size: 11px; }
      .career-board-motivation { margin: 0; color: var(--muted); font-size: 12px; text-align: center; }
      .career-pet { position: fixed; z-index: 10060; width: 150px; height: 166px; transform-origin: bottom center; cursor: grab; user-select: none; touch-action: none; filter: drop-shadow(0 16px 18px rgba(15,23,42,.18)); }
      .career-pet.is-board { z-index: 10070; }
      .career-pet:not(.is-dragging) { animation: careerPetFloat 2.5s ease-in-out infinite; }
      .career-pet.is-dragging { cursor: grabbing; animation: none; transform: scale(var(--pet-scale)); }
      .career-pet.is-switching { animation: careerPetSwitch .42s ease-out both !important; }
      .career-pet-shadow { position: absolute; left: 37px; bottom: 9px; width: 76px; height: 18px; border-radius: 50%; background: rgba(74,44,24,.2); filter: blur(4px); transform: scaleX(1.16); }
      .career-pet-body { position: absolute; left: 18px; bottom: 27px; width: 114px; height: 106px; overflow: visible; border: 3px solid var(--pet-outline); border-radius: 49% 50% 43% 43% / 54% 54% 39% 39%; background: radial-gradient(circle at 24% 23%, rgba(255,255,255,.86) 0 9%, transparent 10%), radial-gradient(circle at 68% 66%, var(--pet-shadow) 0 5%, transparent 46%), linear-gradient(135deg, var(--pet-highlight) 0%, var(--pet-body) 48%, var(--pet-shadow) 100%); box-shadow: 0 0 0 7px rgba(255,255,255,.96), inset 0 -12px 18px rgba(0,0,0,.08), inset 9px 10px 20px rgba(255,255,255,.26), 0 16px 28px rgba(0,0,0,.16); }
      .career-pet.pet-dodo .career-pet-body { border-radius: 50% 51% 42% 42% / 56% 56% 38% 38%; }
      .career-pet.pet-luna .career-pet-body { left: 13px; bottom: 28px; width: 124px; height: 101px; border-radius: 48% 51% 35% 35% / 55% 56% 42% 42%; background: radial-gradient(circle at 20% 30%, rgba(255,252,199,.72) 0 12%, transparent 26%), radial-gradient(circle at 72% 68%, rgba(158,112,232,.34) 0 8%, transparent 50%), linear-gradient(135deg, #fff9cf 0%, var(--pet-highlight) 34%, var(--pet-body) 68%, #a78bfa 100%); }
      .career-pet.pet-sprout .career-pet-body { border-radius: 49% 50% 43% 43% / 56% 57% 39% 39%; background: radial-gradient(circle at 24% 22%, rgba(255,255,255,.8) 0 10%, transparent 11%), linear-gradient(135deg, #e3f7a6 0%, var(--pet-highlight) 36%, var(--pet-body) 69%, #55bea5 100%); }
      .career-pet-gloss { position: absolute; left: 20px; top: 13px; z-index: 2; width: 34px; height: 17px; border-radius: 50%; background: rgba(255,255,255,.58); transform: rotate(-24deg); filter: blur(.2px); }
      .career-pet-gloss::after { content: ""; position: absolute; left: 20px; top: 23px; width: 11px; height: 9px; border-radius: 50%; background: rgba(255,255,255,.55); }
      .career-pet-lobe { position: absolute; z-index: -1; display: none; border: 3px solid var(--pet-outline); background: inherit; box-shadow: 0 0 0 7px rgba(255,255,255,.96), inset 6px 8px 14px rgba(255,255,255,.16); }
      .career-pet.pet-luna .career-pet-lobe { display: block; }
      .career-pet.pet-luna .career-pet-lobe.top { left: 28px; top: -20px; width: 66px; height: 51px; border-radius: 50% 50% 42% 42%; }
      .career-pet.pet-luna .career-pet-lobe.left { left: -18px; top: 36px; width: 48px; height: 54px; border-radius: 56% 43% 40% 62%; }
      .career-pet.pet-luna .career-pet-lobe.right { right: -18px; top: 33px; width: 48px; height: 55px; border-radius: 43% 56% 62% 40%; }
      .career-pet-eye { position: absolute; top: 42px; z-index: 4; width: 23px; height: 27px; border-radius: 50%; background: radial-gradient(circle at 36% 27%, #fff 0 12%, transparent 13%), radial-gradient(circle at 66% 74%, rgba(255,255,255,.42) 0 11%, transparent 12%), linear-gradient(180deg, var(--pet-outline) 0%, #45236e 62%, var(--pet-shadow) 100%); box-shadow: inset 0 -5px 0 rgba(255,255,255,.16), 0 2px 0 rgba(255,255,255,.24); }
      .career-pet-eye::before { content: "✦"; position: absolute; left: 4px; top: 2px; color: #fff; font-size: 16px; line-height: 1; text-shadow: 0 0 7px rgba(255,255,255,.95); }
      .career-pet-eye.left { left: 32px; }
      .career-pet-eye.right { right: 32px; }
      .career-pet.pet-luna .career-pet-eye { background: radial-gradient(circle at 34% 28%, #fff 0 12%, transparent 13%), radial-gradient(circle at 70% 78%, rgba(255,255,255,.44) 0 11%, transparent 12%), linear-gradient(180deg, #5b21b6 0%, #7c3aed 56%, #f0abfc 100%); }
      .career-pet.pet-dodo .career-pet-eye { background: radial-gradient(circle at 34% 28%, #fff 0 12%, transparent 13%), radial-gradient(circle at 70% 78%, rgba(255,255,255,.44) 0 11%, transparent 12%), linear-gradient(180deg, #c2410c 0%, #ea580c 56%, #fde047 100%); }
      .career-pet.pet-sprout .career-pet-eye { width: 26px; height: 31px; background: radial-gradient(circle at 35% 24%, #fff 0 14%, transparent 15%), radial-gradient(circle at 60% 76%, rgba(129,199,132,.82) 0 28%, transparent 29%), #14532d; }
      .career-pet.pet-sprout .career-pet-eye::before { content: ""; }
      .career-pet.is-happy .career-pet-eye { transform: translateY(1px) scaleY(.95); }
      .career-pet.is-worried .career-pet-eye { transform: rotate(8deg) scaleY(.88); }
      .career-pet.is-worried .career-pet-eye.right { transform: rotate(-8deg) scaleY(.88); }
      .career-pet.is-surprised .career-pet-eye { width: 27px; height: 32px; top: 38px; }
      .career-pet-blush { position: absolute; top: 64px; z-index: 3; width: 25px; height: 13px; border-radius: 50%; background: radial-gradient(circle, rgba(255,128,139,.42), rgba(255,128,139,.05) 72%); filter: blur(1px); }
      .career-pet-blush.left { left: 18px; }
      .career-pet-blush.right { right: 18px; }
      .career-pet-mouth { position: absolute; left: 50%; top: 67px; z-index: 5; width: 20px; height: 12px; transform: translateX(-50%); border: 4px solid #dc6b4d; border-top: 0; border-left: 0; border-right: 0; border-radius: 0 0 20px 20px; }
      .career-pet.pet-sprout .career-pet-mouth { border-color: #126332; width: 25px; height: 13px; }
      .career-pet.is-worried .career-pet-mouth { top: 73px; border-top: 4px solid #dc6b4d; border-bottom: 0; border-radius: 20px 20px 0 0; }
      .career-pet.pet-sprout.is-worried .career-pet-mouth { border-top-color: #126332; }
      .career-pet.is-surprised .career-pet-mouth { top: 69px; width: 14px; height: 17px; border: 4px solid #dc6b4d; border-radius: 50%; background: rgba(255,255,255,.42); }
      .career-pet-arm { position: absolute; top: 76px; z-index: 6; width: 40px; height: 31px; border: 5px solid var(--pet-outline); border-top: 0; opacity: .9; }
      .career-pet-arm.left { left: 25px; border-right: 0; border-radius: 0 0 0 34px; transform: rotate(14deg); }
      .career-pet-arm.right { right: 25px; border-left: 0; border-radius: 0 0 34px 0; transform: rotate(-14deg); }
      .career-pet.pet-sprout .career-pet-arm { top: 77px; width: 25px; height: 30px; border-width: 4px; border-color: var(--pet-outline); }
      .career-pet.pet-sprout .career-pet-arm.left { left: -3px; transform: rotate(28deg); }
      .career-pet.pet-sprout .career-pet-arm.right { right: -3px; transform: rotate(-28deg); }
      .career-pet-star { position: absolute; left: 50%; top: 75px; z-index: 7; width: 40px; height: 39px; display: grid; place-items: center; transform: translateX(-50%); color: #fff8b7; font-size: 40px; line-height: 1; text-shadow: 0 0 0 #f59e0b, 1px 0 #f59e0b, -1px 0 #f59e0b, 0 1px #f59e0b, 0 -1px #f59e0b, 0 0 12px rgba(255,238,135,.95); }
      .career-pet.pet-luna .career-pet-star { text-shadow: 0 0 0 #f4a261, 1px 0 #f4a261, -1px 0 #f4a261, 0 1px #f4a261, 0 -1px #f4a261, 0 0 13px rgba(255,244,168,.95); }
      .career-pet.pet-sprout .career-pet-star { display: none; }
      .career-pet-foot { position: absolute; bottom: -22px; z-index: 8; width: 32px; height: 39px; border: 3px solid var(--pet-outline); border-radius: 50%; background: radial-gradient(circle at 34% 24%, rgba(255,255,255,.55) 0 12%, transparent 13%), linear-gradient(145deg, var(--pet-highlight), var(--pet-shadow)); box-shadow: 0 0 0 6px rgba(255,255,255,.96), inset 0 4px 7px rgba(255,255,255,.22); }
      .career-pet-foot.left { left: 24px; transform: rotate(-8deg); }
      .career-pet-foot.right { right: 24px; transform: rotate(8deg); }
      .career-pet.pet-sprout .career-pet-foot { width: 36px; height: 31px; bottom: -17px; }
      .career-pet.pet-sprout .career-pet-foot.left { left: 25px; }
      .career-pet.pet-sprout .career-pet-foot.right { right: 25px; }
      .career-pet-sparkle { position: absolute; z-index: 9; width: 16px; height: 16px; color: rgba(255,255,255,.92); pointer-events: none; }
      .career-pet-sparkle::before { content: "✦"; position: absolute; inset: 0; font-size: 15px; line-height: 1; text-shadow: 0 0 9px rgba(255,255,255,.95); }
      .career-pet-sparkle::after { content: ""; position: absolute; right: -10px; top: 22px; width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.78); box-shadow: -25px 21px 0 rgba(255,255,255,.54), 20px -8px 0 rgba(255,255,255,.42); }
      .career-pet-sparkle.one { left: 21px; top: 29px; }
      .career-pet-sparkle.two { right: 18px; top: 24px; transform: scale(.82); color: #fff6b8; }
      .career-pet-sprout { position: absolute; left: 50%; top: -43px; z-index: 11; width: 42px; height: 54px; transform: translateX(-50%); filter: drop-shadow(0 2px 0 rgba(255,255,255,.9)); }
      .career-pet-sprout::before { content: ""; position: absolute; left: 17px; bottom: 0; width: 9px; height: 39px; border-radius: 999px; background: linear-gradient(#b7d944, #7aa227); box-shadow: inset 2px 0 rgba(255,255,255,.32), 0 0 0 2px #8a8f20; }
      .career-pet-sprout i, .career-pet-leaves i { position: absolute; top: 2px; width: 32px; height: 20px; border: 4px solid #7aa227; border-radius: 80% 12% 80% 12%; background: radial-gradient(circle at 35% 25%, rgba(255,255,255,.58) 0 12%, transparent 13%), linear-gradient(135deg, #f5f276, #a3d337); }
      .career-pet-sprout i:first-child, .career-pet-leaves i:first-child { left: -8px; transform: rotate(30deg); }
      .career-pet-sprout i:last-child, .career-pet-leaves i:last-child { right: -8px; transform: scaleX(-1) rotate(30deg); }
      .career-pet-leaves { position: absolute; left: 50%; top: -44px; z-index: 11; width: 54px; height: 54px; transform: translateX(-50%); filter: drop-shadow(0 2px 0 rgba(255,255,255,.94)); }
      .career-pet-leaves::before { content: ""; position: absolute; left: 23px; top: 17px; width: 11px; height: 40px; border-radius: 999px; background: linear-gradient(#6ed66d, #2f8f46); box-shadow: inset 3px 0 rgba(255,255,255,.24); }
      .career-pet-leaves i { top: 0; width: 38px; height: 25px; border-color: #2f8f46; background: radial-gradient(circle at 35% 25%, rgba(255,255,255,.5) 0 12%, transparent 13%), linear-gradient(135deg, #dcf45f, #61c865); }
      .career-pet-leaves i:first-child { left: -2px; transform: rotate(23deg); }
      .career-pet-leaves i:last-child { right: -2px; transform: scaleX(-1) rotate(23deg); }
      .career-pet-moon { position: absolute; left: 24px; top: -47px; z-index: 12; width: 61px; height: 61px; border: 3px solid #efbd72; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0 9%, transparent 10%), radial-gradient(circle at 38% 42%, #fffbd1 0 33%, #fff3a6 62%, #f2bd6d 100%); box-shadow: 0 0 0 6px rgba(255,255,255,.96), 0 0 18px rgba(255,244,168,.86), inset -5px -5px 0 rgba(244,189,114,.54); transform: rotate(-21deg); }
      .career-pet-moon::after { content: ""; position: absolute; right: -2px; top: 8px; width: 43px; height: 43px; border-radius: 50%; background: linear-gradient(135deg, #fff9cf 0%, var(--pet-highlight) 42%, var(--pet-body) 100%); box-shadow: -4px 2px 0 rgba(255,255,255,.22); }
      .career-pet-switch { position: absolute; right: 2px; top: 17px; z-index: 20; width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.72); border-radius: 50%; background: rgba(255,255,255,.72); color: #4c1d95; cursor: pointer; opacity: 0; transform: translateY(4px) scale(.96); transition: opacity .16s ease, transform .16s ease; backdrop-filter: blur(8px); box-shadow: 0 10px 22px rgba(0,0,0,.16); }
      .career-pet:hover .career-pet-switch, .career-pet.is-menu-open .career-pet-switch { opacity: 1; transform: translateY(0) scale(1); }
      .career-pet-bubble { position: absolute; left: 50%; bottom: 145px; z-index: 30; min-width: 174px; max-width: 246px; transform: translateX(-50%); border: 1px solid rgba(255,255,255,.78); border-radius: 18px; background: rgba(255,255,255,.9); color: #1f2937; padding: 10px 12px; box-shadow: 0 18px 38px rgba(0,0,0,.18); font-size: 13px; font-weight: 800; line-height: 1.45; text-align: center; backdrop-filter: blur(12px); }
      .career-pet-bubble::after { content: ""; position: absolute; left: 50%; bottom: -8px; width: 16px; height: 16px; transform: translateX(-50%) rotate(45deg); background: rgba(255,255,255,.9); border-right: 1px solid rgba(255,255,255,.78); border-bottom: 1px solid rgba(255,255,255,.78); }
      .career-pet-menu { position: absolute; right: 4px; top: 54px; z-index: 24; display: none; gap: 6px; min-width: 122px; border: 1px solid rgba(255,255,255,.58); border-radius: 16px; background: rgba(255,255,255,.88); padding: 7px; box-shadow: 0 18px 34px rgba(0,0,0,.18); backdrop-filter: blur(12px); }
      .career-pet.is-menu-open .career-pet-menu { display: grid; }
      .career-pet-menu button { border: 0; border-radius: 11px; background: transparent; color: #374151; padding: 7px 9px; text-align: left; font-weight: 900; cursor: pointer; }
      .career-pet-menu button:hover, .career-pet-menu button.is-active { background: rgba(124,58,237,.12); color: #5b21b6; }
      @keyframes careerPetFloat {
        0%, 100% { transform: translateY(0) rotate(-1deg) scale(var(--pet-scale)); }
        50% { transform: translateY(-8px) rotate(2deg) scale(var(--pet-scale)); }
      }
      @keyframes careerPetSwitch {
        0% { transform: rotate(0deg) scale(calc(var(--pet-scale) * .8)); opacity: .45; }
        100% { transform: rotate(360deg) scale(var(--pet-scale)); opacity: 1; }
      }
      #careerBlackboardOverlay[hidden] { display: none; }
      #careerBlackboardOverlay { position: fixed; inset: 0; z-index: 9999; }
      .career-board-full { min-height: 100vh; background-color: var(--board-bg, #1e2f23); color: var(--chalk-color, #fff); font-family: "Chalkboard SE", "Comic Sans MS", "Microsoft YaHei", cursive; background-image: radial-gradient(circle at 18% 16%, rgba(255,255,255,.08) 0 1px, transparent 1px), radial-gradient(circle at 72% 22%, rgba(255,255,255,.07) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,.04), transparent 42%, rgba(0,0,0,.16)); background-size: 18px 18px, 26px 26px, 100% 100%; }
      .career-board-top { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.2); padding: 0 18px; backdrop-filter: blur(14px); }
      .career-board-top h2 { margin: 0; color: var(--chalk-color, #fff); font-size: 22px; line-height: 1.1; }
      .career-board-top p { margin: 4px 0 0; color: color-mix(in srgb, var(--chalk-color, #fff) 66%, transparent); font-size: 12px; }
      .career-board-stats { display: flex; gap: 12px; align-items: center; color: color-mix(in srgb, var(--chalk-color, #fff) 76%, transparent); font-size: 13px; }
      .career-board-stats button { min-height: 38px; border: 1px solid rgba(255,255,255,.28); border-radius: 999px; background: rgba(255,255,255,.12); color: var(--chalk-color, #fff); padding: 0 14px; font-weight: 800; cursor: pointer; }
      .career-board-canvas { position: relative; height: calc(100vh - 64px); overflow: hidden; cursor: default; }
      .career-calendar-widget { position: absolute; right: 18px; top: 66px; z-index: 42; width: 286px; border: 1px solid rgba(255,255,255,.16); border-radius: 22px; background: rgba(8,18,14,.34); color: var(--chalk-color, #fff); padding: 14px; box-shadow: 0 24px 56px rgba(0,0,0,.28); backdrop-filter: blur(16px); }
      .career-calendar-widget.is-hidden { display: none; }
      .career-calendar-toggle { position: absolute; right: 18px; top: 66px; z-index: 42; width: 38px; height: 38px; display: none; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; background: rgba(255,255,255,.14); color: #fff; cursor: pointer; box-shadow: 0 16px 34px rgba(0,0,0,.24); backdrop-filter: blur(12px); }
      .career-calendar-toggle.is-visible { display: grid; }
      .career-calendar-head { display: grid; grid-template-columns: 30px minmax(0, 1fr) 30px 26px; align-items: center; gap: 6px; margin-bottom: 10px; }
      .career-calendar-head button { height: 30px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: rgba(255,255,255,.09); color: var(--chalk-color, #fff); cursor: pointer; font-weight: 900; }
      .career-calendar-head button:hover { background: rgba(255,255,255,.16); }
      .career-calendar-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
      .career-calendar-minimize { color: rgba(255,255,255,.72) !important; }
      .career-calendar-weekdays, .career-calendar-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center; }
      .career-calendar-weekdays { margin-bottom: 4px; color: color-mix(in srgb, var(--chalk-color, #fff) 44%, transparent); font-size: 10px; font-weight: 900; }
      .career-calendar-days { gap: 3px; }
      .career-calendar-day { position: relative; aspect-ratio: 1; border: 0; border-radius: 50%; background: transparent; color: color-mix(in srgb, var(--chalk-color, #fff) 76%, transparent); cursor: pointer; font-size: 12px; font-weight: 800; }
      .career-calendar-day:hover { background: rgba(255,255,255,.1); transform: scale(1.05); }
      .career-calendar-day.is-other-month { color: color-mix(in srgb, var(--chalk-color, #fff) 22%, transparent); }
      .career-calendar-day.is-today { box-shadow: inset 0 0 0 1px rgba(255,255,255,.28); }
      .career-calendar-day.has-event::after { content: ""; position: absolute; left: 50%; bottom: 3px; width: 5px; height: 5px; transform: translateX(-50%); border-radius: 50%; }
      .career-calendar-day.has-plan::after { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,.65); }
      .career-calendar-day.has-complete::after { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,.65); }
      .career-calendar-day.has-both::after { background: #fbbf24; box-shadow: 0 0 8px rgba(251,191,36,.7); }
      .career-calendar-day.is-active { background: rgba(251,191,36,.22); color: #fbbf24; transform: scale(1.08); box-shadow: 0 0 18px rgba(251,191,36,.12); }
      .career-calendar-legend { display: flex; justify-content: center; gap: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.09); color: color-mix(in srgb, var(--chalk-color, #fff) 52%, transparent); font-size: 11px; font-weight: 800; }
      .career-calendar-legend span { display: inline-flex; align-items: center; gap: 5px; }
      .career-calendar-legend i { width: 7px; height: 7px; border-radius: 50%; }
      .career-calendar-legend .is-plan { background: #60a5fa; }
      .career-calendar-legend .is-complete { background: #4ade80; }
      .career-calendar-legend .is-both { background: #fbbf24; }
      .career-calendar-empty { margin: 10px 0 0; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; background: rgba(255,255,255,.07); color: color-mix(in srgb, var(--chalk-color, #fff) 62%, transparent); padding: 8px 10px; font-size: 12px; line-height: 1.45; }
      .career-calendar-list { display: grid; gap: 6px; margin-top: 10px; }
      .career-calendar-list p { margin: 0; color: color-mix(in srgb, var(--chalk-color, #fff) 58%, transparent); font-size: 11px; font-weight: 900; }
      .career-calendar-node { display: grid; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 8px; border: 1px solid rgba(251,191,36,.22); border-radius: 12px; background: rgba(251,191,36,.1); color: var(--chalk-color, #fff); padding: 7px 9px; cursor: pointer; text-align: left; }
      .career-calendar-node span { color: #fbbf24; font-size: 11px; font-weight: 900; }
      .career-calendar-node strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
      .career-policy-panel { position: absolute; right: 0; top: 0; bottom: 0; z-index: 70; width: min(420px, 100vw); display: grid; grid-template-rows: auto auto minmax(0, 1fr); border-left: 1px solid rgba(255,255,255,.18); background: rgba(8,18,14,.72); color: var(--chalk-color, #fff); box-shadow: -24px 0 70px rgba(0,0,0,.34); backdrop-filter: blur(22px); animation: careerPolicySlide .22s ease-out; }
      @keyframes careerPolicySlide {
        from { transform: translateX(24px); opacity: .2; }
        to { transform: translateX(0); opacity: 1; }
      }
      .career-policy-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px; border-bottom: 1px solid rgba(255,255,255,.12); }
      .career-policy-head p { margin: 0 0 4px; color: color-mix(in srgb, var(--chalk-color, #fff) 58%, transparent); font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .career-policy-head h3 { margin: 0; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 22px; line-height: 1.15; }
      .career-policy-head button { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,.2); border-radius: 50%; background: rgba(255,255,255,.1); color: var(--chalk-color, #fff); font-size: 24px; cursor: pointer; }
      .career-policy-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,.1); }
      .career-policy-tabs button { min-height: 36px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: rgba(255,255,255,.08); color: color-mix(in srgb, var(--chalk-color, #fff) 72%, transparent); font-size: 12px; font-weight: 900; cursor: pointer; }
      .career-policy-tabs button.is-active { border-color: rgba(251,191,36,.55); background: rgba(251,191,36,.16); color: #fbbf24; }
      .career-policy-body { min-height: 0; overflow: auto; display: grid; align-content: start; gap: 12px; padding: 14px; }
      .career-policy-body::-webkit-scrollbar { width: 6px; }
      .career-policy-body::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.22); }
      .career-policy-card { border: 1px solid rgba(255,255,255,.15); border-radius: 18px; background: rgba(255,255,255,.08); padding: 12px; box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
      .career-policy-card.is-custom { border-color: rgba(96,165,250,.34); }
      .career-policy-card-head { display: grid; grid-template-columns: minmax(0, 1fr) 30px; gap: 10px; align-items: start; }
      .career-policy-card-head p { margin: 0 0 4px; color: #fbbf24; font-size: 11px; font-weight: 900; }
      .career-policy-card-head h4 { margin: 0; color: var(--chalk-color, #fff); font-size: 15px; line-height: 1.35; }
      .career-policy-card-head button { width: 30px; height: 30px; border: 1px solid rgba(255,255,255,.16); border-radius: 50%; background: rgba(255,255,255,.08); color: var(--chalk-color, #fff); cursor: pointer; }
      .career-policy-summary { margin: 8px 0 0; color: color-mix(in srgb, var(--chalk-color, #fff) 72%, transparent); font-size: 12px; line-height: 1.55; }
      .career-policy-detail { display: grid; gap: 8px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 10px; color: color-mix(in srgb, var(--chalk-color, #fff) 64%, transparent); font-size: 12px; }
      .career-policy-detail p { margin: 0; }
      .career-policy-detail a { color: #93c5fd; font-weight: 900; text-decoration: none; }
      .career-policy-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .career-policy-actions button { min-height: 32px; border: 1px solid rgba(251,191,36,.3); border-radius: 999px; background: rgba(251,191,36,.12); color: #fbbf24; padding: 0 12px; font-weight: 900; cursor: pointer; }
      .career-policy-actions button.is-danger { border-color: rgba(248,113,113,.3); background: rgba(248,113,113,.12); color: #fecaca; }
      .career-policy-empty { border: 1px dashed rgba(255,255,255,.16); border-radius: 18px; color: color-mix(in srgb, var(--chalk-color, #fff) 62%, transparent); margin: 0; padding: 16px; font-size: 13px; line-height: 1.55; text-align: center; }
      .career-policy-search { display: grid; gap: 12px; }
      .career-policy-search label, .career-policy-form { display: grid; gap: 8px; color: color-mix(in srgb, var(--chalk-color, #fff) 72%, transparent); font-size: 12px; font-weight: 900; }
      .career-policy-search input, .career-policy-search textarea, .career-policy-search select { width: 100%; border: 1px solid rgba(255,255,255,.16); border-radius: 12px; background: rgba(255,255,255,.09); color: var(--chalk-color, #fff); padding: 10px 12px; outline: none; }
      .career-policy-search textarea { min-height: 76px; resize: vertical; }
      .career-policy-search-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .career-policy-search-actions a, .career-policy-form button { display: grid; place-items: center; min-height: 40px; border: 1px solid rgba(96,165,250,.28); border-radius: 14px; background: rgba(96,165,250,.13); color: #bfdbfe; text-decoration: none; font-weight: 900; cursor: pointer; }
      .career-policy-form { margin-top: 8px; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(255,255,255,.07); padding: 12px; }
      .career-policy-form p { margin: 0; color: #fbbf24; }
      .career-policy-form div { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .career-policy-button { position: absolute; right: 4px; bottom: -14px; z-index: 14; width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid rgba(251,191,36,.34); border-radius: 50%; background: rgba(251,191,36,.16); color: #fff7ed; cursor: pointer; box-shadow: 0 10px 22px rgba(0,0,0,.24); opacity: .88; }
      .career-policy-button:hover { background: rgba(251,191,36,.26); opacity: 1; transform: scale(1.05); }
      .career-policy-note-summary { max-width: 260px; margin: 7px auto 0; border: 1px solid rgba(251,191,36,.24); border-radius: 12px; background: rgba(251,191,36,.1); color: #fef3c7; padding: 6px 9px; font-size: 11px; line-height: 1.4; text-align: center; }
      .career-policy-radar { position: absolute; right: 18px; bottom: 64px; z-index: 36; width: 300px; display: grid; gap: 3px; border: 1px solid rgba(251,191,36,.24); border-radius: 18px; background: rgba(26,20,8,.58); color: var(--chalk-color, #fff); padding: 12px 14px; text-align: left; cursor: pointer; box-shadow: 0 20px 46px rgba(0,0,0,.28); backdrop-filter: blur(14px); }
      .career-policy-radar span { color: #fbbf24; font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .career-policy-radar strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
      .career-policy-radar small { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: color-mix(in srgb, var(--chalk-color, #fff) 68%, transparent); font-size: 12px; line-height: 1.4; }
      .career-catalog-panel { position: absolute; left: 18px; top: 18px; bottom: 18px; z-index: 45; width: 318px; border: 1px solid rgba(255,255,255,.18); border-radius: 24px; background: rgba(8,18,14,.36); box-shadow: 0 28px 60px rgba(0,0,0,.28); backdrop-filter: blur(16px); transition: transform .24s ease, width .24s ease; }
      .career-catalog-panel.is-collapsed { width: 42px; transform: translateX(-8px); }
      .career-catalog-inner { height: 100%; display: grid; grid-template-rows: auto auto auto minmax(0, 1fr); gap: 10px; padding: 14px; opacity: 1; transition: opacity .16s ease; }
      .career-catalog-panel.is-collapsed .career-catalog-inner { opacity: 0; pointer-events: none; }
      .career-catalog-toggle { position: absolute; right: -15px; top: 50%; z-index: 2; width: 30px; height: 54px; transform: translateY(-50%); border: 1px solid rgba(255,255,255,.22); border-radius: 999px; background: rgba(255,255,255,.14); color: var(--chalk-color, #fff); font-weight: 900; cursor: pointer; box-shadow: 0 16px 34px rgba(0,0,0,.24); backdrop-filter: blur(12px); }
      .career-catalog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; color: var(--chalk-color, #fff); }
      .career-catalog-head p { margin: 0 0 3px; color: color-mix(in srgb, var(--chalk-color, #fff) 58%, transparent); font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .career-catalog-head h3 { margin: 0; font-size: 20px; line-height: 1.1; }
      .career-catalog-head span { border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: rgba(255,255,255,.1); color: color-mix(in srgb, var(--chalk-color, #fff) 76%, transparent); padding: 4px 8px; font-size: 11px; font-weight: 900; white-space: nowrap; }
      .career-catalog-search { width: 100%; min-height: 36px; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; background: rgba(255,255,255,.1); color: var(--chalk-color, #fff); padding: 0 12px; outline: none; }
      .career-catalog-search::placeholder { color: color-mix(in srgb, var(--chalk-color, #fff) 46%, transparent); }
      .career-catalog-hint { border: 1px solid rgba(255,255,255,.12); border-radius: 14px; background: rgba(255,255,255,.08); color: color-mix(in srgb, var(--chalk-color, #fff) 68%, transparent); padding: 8px 10px; font-size: 12px; line-height: 1.45; }
      .career-catalog-tree { min-height: 0; overflow: auto; padding-right: 3px; }
      .career-catalog-tree::-webkit-scrollbar { width: 5px; }
      .career-catalog-tree::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.2); }
      .career-tree-node { display: grid; gap: 3px; }
      .career-tree-row { min-height: 32px; display: grid; grid-template-columns: 20px 18px minmax(0, 1fr) 10px auto 26px; align-items: center; gap: 7px; padding: 4px 7px 4px calc(7px + var(--tree-depth, 0) * 14px); border-radius: 12px; color: color-mix(in srgb, var(--chalk-color, #fff) 76%, transparent); cursor: pointer; }
      .career-tree-row:hover { background: rgba(255,255,255,.08); color: var(--chalk-color, #fff); }
      .career-tree-row.is-on-board { background: rgba(251,191,36,.12); color: var(--chalk-color, #fff); }
      .career-tree-expand { width: 20px; height: 20px; display: grid; place-items: center; border: 0; border-radius: 6px; background: transparent; color: color-mix(in srgb, var(--chalk-color, #fff) 58%, transparent); cursor: pointer; font-size: 10px; transition: transform .18s ease, background .18s ease; }
      .career-tree-expand:hover { background: rgba(255,255,255,.1); color: var(--chalk-color, #fff); }
      .career-tree-expand.is-expanded { transform: rotate(90deg); }
      .career-tree-expand.is-hidden { visibility: hidden; }
      .career-tree-check { width: 16px; height: 16px; accent-color: #fbbf24; cursor: pointer; }
      .career-tree-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 800; }
      .career-tree-label.is-on-board { color: #fbbf24; }
      .career-tree-status { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.18); }
      .career-tree-row.is-on-board .career-tree-status { background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,.56); }
      .career-tree-badge { border-radius: 999px; background: rgba(255,255,255,.1); color: color-mix(in srgb, var(--chalk-color, #fff) 58%, transparent); padding: 1px 7px; font-size: 11px; font-weight: 900; }
      .career-tree-policy, .career-tree-policy-spacer { width: 24px; height: 24px; }
      .career-tree-policy { display: grid; place-items: center; border: 1px solid rgba(251,191,36,.25); border-radius: 50%; background: rgba(251,191,36,.12); color: #fef3c7; cursor: pointer; font-size: 12px; }
      .career-tree-policy:hover { background: rgba(251,191,36,.24); }
      .career-tree-children.is-collapsed { display: none; }
      .career-catalog-empty { color: color-mix(in srgb, var(--chalk-color, #fff) 56%, transparent); font-size: 13px; text-align: center; }
      .career-board-tools { position: absolute; left: 360px; top: 20px; z-index: 30; width: 144px; border: 1px solid rgba(255,255,255,.2); border-radius: 24px; background: rgba(255,255,255,.1); padding: 12px; box-shadow: 0 24px 50px rgba(0,0,0,.28); backdrop-filter: blur(12px); transition: left .24s ease; }
      .career-catalog-panel.is-collapsed + .career-board-tools { left: 72px; }
      .career-theme-selector { position: absolute; top: 16px; right: 18px; z-index: 50; }
      .career-theme-toggle { min-height: 38px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px; background: rgba(255,255,255,.16); color: var(--chalk-color, #fff); padding: 0 14px; font-weight: 800; cursor: pointer; box-shadow: 0 16px 34px rgba(0,0,0,.22); backdrop-filter: blur(12px); }
      .career-theme-toggle small { font-size: 10px; opacity: .72; }
      .career-theme-menu { position: absolute; top: 48px; right: 0; width: 184px; border: 1px solid rgba(255,255,255,.22); border-radius: 18px; background: rgba(10,18,14,.72); padding: 8px; box-shadow: 0 24px 56px rgba(0,0,0,.34); backdrop-filter: blur(18px); }
      .career-theme-menu button { width: 100%; min-height: 38px; display: flex; align-items: center; gap: 10px; border: 0; border-radius: 12px; background: transparent; color: rgba(255,255,255,.76); padding: 0 10px; text-align: left; font-weight: 800; cursor: pointer; }
      .career-theme-menu button:hover, .career-theme-menu button.is-active { background: rgba(255,255,255,.14); color: #fff; }
      .career-theme-menu button span { width: 18px; height: 18px; border: 1px solid rgba(255,255,255,.34); border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(255,255,255,.08); }
      .career-board-tools p { margin: 0 8px 10px; color: color-mix(in srgb, var(--chalk-color, #fff) 68%, transparent); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .career-tool { width: 100%; text-align: left; border: 1px solid rgba(255,255,255,.25); border-radius: 16px; background: rgba(255,255,255,.15); color: var(--chalk-color, #fff); padding: 10px 12px; margin-top: 8px; cursor: grab; box-shadow: 0 14px 28px rgba(0,0,0,.18); }
      .career-tool strong, .career-tool span { display: block; }
      .career-tool span { color: color-mix(in srgb, var(--chalk-color, #fff) 66%, transparent); font-size: 12px; }
      .career-board-lines { position: absolute; inset: 0; z-index: 10; width: 100%; height: 100%; pointer-events: none; }
      .career-edge-hit { pointer-events: stroke; cursor: context-menu; }
      .career-node { position: absolute; z-index: 20; user-select: none; cursor: grab; }
      .career-node-bubble { position: relative; display: flex; align-items: center; gap: 8px; min-height: 52px; border: 1px solid rgba(255,255,255,.34); border-radius: 50px; background: linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.04)), var(--node-bg, rgba(255,255,255,.15)), var(--node-color); color: var(--chalk-color, #fff); padding: 12px 24px; box-shadow: 0 18px 42px rgba(0,0,0,.22); backdrop-filter: blur(8px); text-shadow: 0 0 12px rgba(255,255,255,.42); }
      .career-node.is-policy-note .career-node-bubble { border-color: rgba(251,191,36,.42); border-radius: 18px; background: linear-gradient(135deg, rgba(255,246,196,.28), rgba(251,191,36,.16)), rgba(95,67,16,.42); color: #fff7ed; transform: rotate(-1deg); }
      .career-node.is-policy-note .career-node-type { color: #fbbf24; border-color: rgba(251,191,36,.32); background: rgba(251,191,36,.12); }
      .career-node.is-linking .career-node-bubble { border-color: rgba(255,214,102,.95); box-shadow: 0 0 0 4px rgba(255,214,102,.18), 0 18px 42px rgba(0,0,0,.25); }
      .career-node.is-calendar-highlighted { z-index: 29; }
      .career-node.is-calendar-highlighted .career-node-bubble { border-color: rgba(251,191,36,.82); box-shadow: 0 0 0 4px rgba(251,191,36,.18), 0 0 34px rgba(251,191,36,.42), 0 18px 42px rgba(0,0,0,.28); animation: careerCalendarPulse 1.4s ease-in-out infinite; }
      @keyframes careerCalendarPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.035); }
      }
      .career-node-type { border: 1px solid rgba(255,255,255,.2); border-radius: 999px; background: rgba(255,255,255,.1); color: color-mix(in srgb, var(--chalk-color, #fff) 82%, transparent); padding: 2px 8px; font-size: 11px; }
      .career-node strong { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 18px; line-height: 1; }
      .career-pin { position: absolute; right: -8px; top: -12px; z-index: 14; width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.3); border-radius: 50%; background: rgba(0,0,0,.2); color: #fff; cursor: pointer; box-shadow: 0 10px 22px rgba(0,0,0,.26); }
      .career-progress-ring { position: absolute; right: -30px; top: -30px; z-index: 12; display: grid; place-items: center; pointer-events: none; }
      .career-progress-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
      .career-progress-ring span { position: relative; color: #fff; font-size: 11px; font-weight: 900; line-height: 1; text-shadow: 0 0 8px rgba(0,0,0,.85); }
      .career-note-dot { position: absolute; left: 12px; bottom: -4px; width: 12px; height: 12px; border: 1px solid rgba(255,255,255,.8); border-radius: 50%; background: #fde047; box-shadow: 0 0 14px rgba(253,224,71,.9); }
      .career-note-button { display: flex; align-items: center; gap: 4px; min-height: 28px; margin: 8px auto 0; border: 1px solid rgba(255,255,255,.25); border-radius: 999px; background: rgba(255,255,255,.1); color: color-mix(in srgb, var(--chalk-color, #fff) 86%, transparent); padding: 0 12px; font-size: 12px; font-weight: 800; cursor: pointer; backdrop-filter: blur(10px); }
      .career-link-hint { position: absolute; bottom: 24px; left: 50%; z-index: 40; transform: translateX(-50%); border: 1px solid rgba(255,218,185,.4); border-radius: 999px; background: rgba(0,0,0,.25); color: #ffedd5; padding: 10px 18px; font-weight: 800; box-shadow: 0 16px 36px rgba(0,0,0,.22); backdrop-filter: blur(10px); }
      .career-dependency-legend { position: absolute; right: 18px; bottom: 18px; z-index: 35; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; background: rgba(0,0,0,.22); color: color-mix(in srgb, var(--chalk-color, #fff) 72%, transparent); padding: 8px 12px; font-size: 12px; font-weight: 900; backdrop-filter: blur(10px); }
      .career-dependency-legend span { width: 36px; height: 0; border-top: 3px dashed var(--edge-color, #ff7b54); filter: drop-shadow(0 0 4px var(--edge-color, #ff7b54)); }
      .career-context-menu { position: fixed; z-index: 10030; min-width: 128px; border: 1px solid rgba(255,255,255,.22); border-radius: 16px; background: rgba(31,43,34,.96); padding: 8px; box-shadow: 0 22px 58px rgba(0,0,0,.35); backdrop-filter: blur(12px); }
      .career-context-menu button { width: 100%; border: 0; border-radius: 12px; background: transparent; color: #fee2e2; padding: 9px 12px; text-align: left; font-weight: 800; cursor: pointer; }
      .career-context-menu button:hover { background: rgba(248,113,113,.2); }
      .career-note-modal { position: fixed; inset: 0; z-index: 10020; display: grid; place-items: center; background: rgba(0,0,0,.55); padding: 20px; backdrop-filter: blur(4px); }
      .career-note-panel { width: min(100%, 560px); border: 1px solid rgba(255,255,255,.25); border-radius: 28px; background: #f8f4df; color: #213327; padding: 24px; box-shadow: 0 24px 70px rgba(0,0,0,.35); }
      .career-note-head { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
      .career-note-head p { margin: 0; color: #7f6b2e; font-size: 13px; font-weight: 800; }
      .career-note-head h3 { margin: 4px 0 0; font-size: 26px; line-height: 1.2; }
      .career-note-head button { width: 36px; height: 36px; border: 0; border-radius: 50%; background: #213327; color: #fff; font-size: 24px; cursor: pointer; }
      .career-note-panel label { display: grid; gap: 8px; margin-top: 12px; font-size: 14px; font-weight: 800; }
      .career-note-panel input, .career-note-panel textarea { width: 100%; border: 1px solid #d4c796; border-radius: 14px; background: #fff; color: #213327; padding: 10px 12px; outline: none; }
      .career-note-panel textarea { min-height: 128px; resize: vertical; }
      .career-note-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
      .career-note-actions button { min-height: 42px; border-radius: 999px; padding: 0 18px; font-weight: 800; cursor: pointer; }
      .career-note-actions button:first-child { border: 1px solid #9d8f60; background: transparent; color: #4b4222; }
      .career-note-actions button:last-child { border: 0; background: #213327; color: #fff; }
      @media (max-width: 760px) {
        .career-board-card { grid-template-columns: 1fr; }
        .career-board-home-side { width: 100%; }
        .career-board-thumb { width: 100%; max-width: 300px; }
        .career-board-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .career-board-top { align-items: flex-start; height: auto; min-height: 76px; flex-direction: column; padding: 12px 16px; }
        .career-board-canvas { height: calc(100vh - 98px); }
        .career-board-stats { flex-wrap: wrap; }
        .career-theme-selector { top: 104px; right: 14px; }
        .career-calendar-widget { top: 152px; right: 14px; width: min(286px, calc(100vw - 28px)); }
        .career-calendar-toggle { top: 152px; right: 14px; }
        .career-policy-panel { width: 100vw; }
        .career-policy-radar { left: 14px; right: 14px; bottom: 58px; width: auto; }
        .career-policy-search-actions, .career-policy-form div { grid-template-columns: 1fr; }
        .career-catalog-panel { width: min(310px, calc(100vw - 42px)); top: 14px; bottom: 14px; left: 12px; }
        .career-board-tools { left: 70px; top: 104px; width: 132px; }
        .career-catalog-panel:not(.is-collapsed) + .career-board-tools { display: none; }
        .career-dependency-legend { left: 14px; right: auto; bottom: 14px; max-width: calc(100vw - 28px); }
      }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener("mousemove", (event) => {
    if (petDragging?.element) {
      const dragMode = petDragging.element.dataset.petMode === "board" ? "board" : "home";
      const maxX = Math.max(8, window.innerWidth - (dragMode === "board" ? 116 : 148));
      const maxY = Math.max(8, window.innerHeight - (dragMode === "board" ? 128 : 158));
      const nextX = Math.min(Math.max(event.clientX - petDragging.offsetX, 8), maxX);
      const nextY = Math.min(Math.max(event.clientY - petDragging.offsetY, 8), maxY);
      petDragging.element.style.left = `${nextX}px`;
      petDragging.element.style.top = `${nextY}px`;
      if (Math.hypot(event.clientX - petDragging.offsetX - nextX, event.clientY - petDragging.offsetY - nextY) >= 0) {
        petDragging.moved = true;
      }
      return;
    }

    const board = document.getElementById("careerBoardCanvas");
    if (draggingNode && board) {
      const rect = board.getBoundingClientRect();
      const node = plan.nodes.find((item) => item.id === draggingNode.nodeId);
      if (!node) return;
      const size = getNodeSize(node);
      node.x = Math.min(Math.max(event.clientX - rect.left - draggingNode.offsetX, 12), rect.width - size.width - 12);
      node.y = Math.min(Math.max(event.clientY - rect.top - draggingNode.offsetY, 12), rect.height - size.height - 12);
      savePlan();
      renderBoard();
      return;
    }

    if (draggingTool) {
      const distance = Math.hypot(event.clientX - draggingTool.startX, event.clientY - draggingTool.startY);
      if (distance > 6) draggingTool.moved = true;
    }
  });

  window.addEventListener("mouseup", (event) => {
    if (petDragging) {
      const rect = petDragging.element.getBoundingClientRect();
      savePetPosition(petDragging.id, rect.left, rect.top);
      petDragging.element.classList.remove("is-dragging");
      petClickSuppressed = Boolean(petDragging.moved);
      petDragging = null;
      document.body.style.userSelect = "";
    }

    if (draggingNode) {
      draggingNode = null;
      document.body.style.userSelect = "";
    }

    if (draggingTool) {
      const board = document.getElementById("careerBoardCanvas");
      const rect = board?.getBoundingClientRect();
      if (draggingTool.moved && rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
        createNode(draggingTool.type, event.clientX - rect.left - 68, event.clientY - rect.top - 28);
      } else {
        const width = board?.clientWidth || window.innerWidth;
        const height = board?.clientHeight || window.innerHeight;
        createNode(draggingTool.type, width / 2 - 72 + (Math.random() - 0.5) * 220, height / 2 - 32 + (Math.random() - 0.5) * 160);
      }
      draggingTool = null;
      document.body.style.userSelect = "";
    }
  });

  window.addEventListener("click", () => {
    document.querySelectorAll("[data-pet-root].is-menu-open").forEach((pet) => pet.classList.remove("is-menu-open"));
    if (contextMenu) {
      contextMenu = null;
      renderBoard();
    }
  });

  window.addEventListener("storage", () => {
    plan = readPlan();
    renderHome();
    renderBoard();
  });

  function init() {
    addStyles();
    ensureStoredPlan();
    renderHome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
