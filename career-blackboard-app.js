(() => {
  const STORAGE_KEY = "career_plan_data";
  const CHANGE_EVENT = "career-plan-data-change";
  const NODE_TYPES = {
    major: { label: "专业", title: "新专业", colors: ["rgba(255, 214, 102, 0.28)", "rgba(255, 183, 77, 0.26)"] },
    career: { label: "职业", title: "新职业", colors: ["rgba(128, 203, 196, 0.28)", "rgba(129, 212, 250, 0.24)"] },
    position: { label: "职位", title: "新职位", colors: ["rgba(206, 147, 216, 0.26)", "rgba(244, 143, 177, 0.24)"] },
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
  let isBoardOpen = false;
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

  function savePlan() {
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
        <rect width="${width}" height="${height}" rx="18" fill="#1e2f23" />
        <rect width="${width}" height="${height}" rx="18" fill="url(#careerThumbDust)" opacity="0.85" />
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="14" fill="none" stroke="rgba(255,255,255,0.16)" />
        ${plan.edges
          .map((edge) => {
            const source = thumbNodes.find((node) => node.id === edge.sourceId);
            const target = thumbNodes.find((node) => node.id === edge.targetId);
            if (!source || !target) return "";
            return `<path d="${makeBezier(thumbCenter(source), thumbCenter(target))}" fill="none" stroke="#ff7b54" stroke-dasharray="4 4" stroke-linecap="round" stroke-width="1.8" opacity="0.9" />`;
          })
          .join("")}
        ${thumbNodes
          .map((node) => {
            const title = node.title.length > 7 ? `${node.title.slice(0, 7)}…` : node.title;
            return `
              <g>
                <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${Math.min(26, node.height / 2)}" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" />
                <text x="${node.x + node.width / 2}" y="${node.y + node.height / 2 + 4}" text-anchor="middle" fill="#fff" font-size="${Math.max(10, 15 * scale)}" font-weight="700" font-family="Chalkboard SE, Comic Sans MS, Microsoft YaHei, cursive">${escapeHtml(title)}</text>
              </g>`;
          })
          .join("")}
      </svg>
    `;
  }

  function renderHome() {
    const root = document.getElementById("careerBlackboardHome");
    if (!root) return;
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
        <div class="career-board-thumb" title="${plan.nodes.length} 个节点 · ${plan.edges.length} 条连线">
          ${renderThumbnail(300, 200)}
        </div>
      </article>
    `;
    document.getElementById("openCareerBlackboard")?.addEventListener("click", openBoard);
  }

  function renderBoard() {
    if (!isBoardOpen) return;
    const overlay = document.getElementById("careerBlackboardOverlay");
    if (!overlay) return;

    overlay.hidden = false;
    overlay.innerHTML = `
      <div class="career-board-full">
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
                return `
                  <g>
                    <path d="${path}" fill="none" stroke="rgba(89,41,23,0.26)" stroke-linecap="round" stroke-width="9"></path>
                    <path d="${path}" fill="none" stroke="#ff7b54" stroke-dasharray="10 7" stroke-linecap="round" stroke-width="3" filter="url(#careerThreadRoughen)"></path>
                    <path class="career-edge-hit" data-edge-id="${edge.id}" d="${path}" fill="none" stroke="transparent" stroke-linecap="round" stroke-width="18"></path>
                  </g>`;
              })
              .join("")}
          </svg>
          ${plan.nodes
            .map((node) => {
              const typeInfo = NODE_TYPES[node.type];
              return `
                <div class="career-node ${linkSourceId === node.id ? "is-linking" : ""}" data-node-id="${node.id}" style="left:${node.x}px; top:${node.y}px; --node-color:${node.color};">
                  <div class="career-node-bubble">
                    <span class="career-node-type">${typeInfo.label}</span>
                    <strong>${escapeHtml(node.title)}</strong>
                    <button type="button" class="career-pin" data-pin-id="${node.id}" aria-label="从 ${escapeHtml(node.title)} 开始连线">📌</button>
                    ${noteForNode(node.id) ? '<span class="career-note-dot" aria-label="已有备注"></span>' : ""}
                  </div>
                  <button type="button" class="career-note-button" data-note-id="${node.id}">💬 备注</button>
                </div>`;
            })
            .join("")}
          ${linkSourceId ? '<div class="career-link-hint">连线模式：再点击另一个泡泡生成毛线连接</div>' : ""}
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
    renderBoard();
  }

  function closeBoard() {
    isBoardOpen = false;
    linkSourceId = null;
    draggingNode = null;
    draggingTool = null;
    contextMenu = null;
    activeNoteNodeId = null;
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
      .career-board-thumb { width: 300px; height: 200px; overflow: hidden; border-radius: 18px; box-shadow: 0 18px 38px rgba(0,0,0,.18); }
      #careerBlackboardOverlay[hidden] { display: none; }
      #careerBlackboardOverlay { position: fixed; inset: 0; z-index: 9999; }
      .career-board-full { min-height: 100vh; background: #1e2f23; color: #fff; font-family: "Chalkboard SE", "Comic Sans MS", "Microsoft YaHei", cursive; background-image: radial-gradient(circle at 18% 16%, rgba(255,255,255,.08) 0 1px, transparent 1px), radial-gradient(circle at 72% 22%, rgba(255,255,255,.07) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,.04), transparent 42%, rgba(0,0,0,.16)); background-size: 18px 18px, 26px 26px, 100% 100%; }
      .career-board-top { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.2); padding: 0 18px; backdrop-filter: blur(14px); }
      .career-board-top h2 { margin: 0; color: #fff; font-size: 22px; line-height: 1.1; }
      .career-board-top p { margin: 4px 0 0; color: rgba(255,255,255,.66); font-size: 12px; }
      .career-board-stats { display: flex; gap: 12px; align-items: center; color: rgba(255,255,255,.76); font-size: 13px; }
      .career-board-stats button { min-height: 38px; border: 1px solid rgba(255,255,255,.28); border-radius: 999px; background: rgba(255,255,255,.12); color: #fff; padding: 0 14px; font-weight: 800; cursor: pointer; }
      .career-board-canvas { position: relative; height: calc(100vh - 64px); overflow: hidden; cursor: default; }
      .career-board-tools { position: absolute; left: 20px; top: 20px; z-index: 30; width: 144px; border: 1px solid rgba(255,255,255,.2); border-radius: 24px; background: rgba(255,255,255,.1); padding: 12px; box-shadow: 0 24px 50px rgba(0,0,0,.28); backdrop-filter: blur(12px); }
      .career-board-tools p { margin: 0 8px 10px; color: rgba(255,255,255,.68); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .career-tool { width: 100%; text-align: left; border: 1px solid rgba(255,255,255,.25); border-radius: 16px; background: rgba(255,255,255,.15); color: #fff; padding: 10px 12px; margin-top: 8px; cursor: grab; box-shadow: 0 14px 28px rgba(0,0,0,.18); }
      .career-tool strong, .career-tool span { display: block; }
      .career-tool span { color: rgba(255,255,255,.66); font-size: 12px; }
      .career-board-lines { position: absolute; inset: 0; z-index: 10; width: 100%; height: 100%; pointer-events: none; }
      .career-edge-hit { pointer-events: stroke; cursor: context-menu; }
      .career-node { position: absolute; z-index: 20; user-select: none; cursor: grab; }
      .career-node-bubble { position: relative; display: flex; align-items: center; gap: 8px; min-height: 52px; border: 1px solid rgba(255,255,255,.34); border-radius: 50px; background: linear-gradient(135deg, rgba(255,255,255,.24), rgba(255,255,255,.12)), var(--node-color); color: #fff; padding: 12px 24px; box-shadow: 0 18px 42px rgba(0,0,0,.22); backdrop-filter: blur(8px); text-shadow: 0 0 12px rgba(255,255,255,.42); }
      .career-node.is-linking .career-node-bubble { border-color: rgba(255,214,102,.95); box-shadow: 0 0 0 4px rgba(255,214,102,.18), 0 18px 42px rgba(0,0,0,.25); }
      .career-node-type { border: 1px solid rgba(255,255,255,.2); border-radius: 999px; background: rgba(255,255,255,.1); color: rgba(255,255,255,.82); padding: 2px 8px; font-size: 11px; }
      .career-node strong { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 18px; line-height: 1; }
      .career-pin { position: absolute; right: -8px; top: -12px; width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.3); border-radius: 50%; background: rgba(0,0,0,.2); color: #fff; cursor: pointer; box-shadow: 0 10px 22px rgba(0,0,0,.26); }
      .career-note-dot { position: absolute; left: 12px; bottom: -4px; width: 12px; height: 12px; border: 1px solid rgba(255,255,255,.8); border-radius: 50%; background: #fde047; box-shadow: 0 0 14px rgba(253,224,71,.9); }
      .career-note-button { display: flex; align-items: center; gap: 4px; min-height: 28px; margin: 8px auto 0; border: 1px solid rgba(255,255,255,.25); border-radius: 999px; background: rgba(255,255,255,.1); color: rgba(255,255,255,.86); padding: 0 12px; font-size: 12px; font-weight: 800; cursor: pointer; backdrop-filter: blur(10px); }
      .career-link-hint { position: absolute; bottom: 24px; left: 50%; z-index: 40; transform: translateX(-50%); border: 1px solid rgba(255,218,185,.4); border-radius: 999px; background: rgba(0,0,0,.25); color: #ffedd5; padding: 10px 18px; font-weight: 800; box-shadow: 0 16px 36px rgba(0,0,0,.22); backdrop-filter: blur(10px); }
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
        .career-board-thumb { width: 100%; max-width: 300px; }
        .career-board-top { align-items: flex-start; height: auto; min-height: 76px; flex-direction: column; padding: 12px 16px; }
        .career-board-canvas { height: calc(100vh - 98px); }
        .career-board-stats { flex-wrap: wrap; }
      }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener("mousemove", (event) => {
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
