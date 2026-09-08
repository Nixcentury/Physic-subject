import { NotebookCore } from "../pages/tools/notebook-core.js";

const EVIDENCE_SCHEMA = "HUB_QUIZ_EVIDENCE_V1";
const NOTEBOOK_DB = "learning-hub-quiz-evidence";
const NOTEBOOK_STORE = "notebookPages";
const AI_WORKER_FALLBACK =
  "https://student-work-ai-checker.micksattawatbutklo.workers.dev/";
const PDF_PAGE_LIMIT = 20;

let notebookDatabasePromise = null;

function clone(value) {
  if (value == null) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function openNotebookDatabase() {
  if (!window.indexedDB) return Promise.resolve(null);
  if (notebookDatabasePromise) return notebookDatabasePromise;

  notebookDatabasePromise = new Promise((resolve) => {
    const request = indexedDB.open(NOTEBOOK_DB, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(NOTEBOOK_STORE)) {
        database.createObjectStore(NOTEBOOK_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });

  return notebookDatabasePromise;
}

async function notebookRecord(action, key, value) {
  const database = await openNotebookDatabase();
  if (!database) return null;

  return new Promise((resolve) => {
    try {
      const transaction = database.transaction(NOTEBOOK_STORE, "readwrite");
      const store = transaction.objectStore(NOTEBOOK_STORE);
      const request =
        action === "get"
          ? store.get(key)
          : action === "delete"
            ? store.delete(key)
            : store.put(value, key);
      request.onsuccess = () => resolve(action === "get" ? request.result || null : true);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function safeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function activeLanguageNode(source, language) {
  if (!source) return null;
  return (
    source.querySelector?.(`[data-quiz-language="${language}"]`) ||
    source.querySelector?.("[data-quiz-language]") ||
    source
  );
}

function selectedOptionText(question, answer) {
  const option = question.options.find((item) => item.dataset.choiceId === answer);
  return safeText(option?.textContent || answer || "");
}

function createVerificationId() {
  const random = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  return `AI-${String(random).replace(/[^a-z0-9]/gi, "").slice(0, 12).toUpperCase()}`;
}

function parseWorkerText(data) {
  if (!data) return "";
  if (typeof data === "string") return data.trim();
  const direct = [
    data.reply,
    data.message,
    data.answer,
    data.text,
    data.response,
    data.output_text,
  ].find((value) => typeof value === "string" && value.trim());
  return direct?.trim() || "";
}

function normalizeWorkerReview(data) {
  const feedback =
    data?.feedback && typeof data.feedback === "object"
      ? data.feedback
      : data && typeof data === "object"
        ? data
        : {};
  const statusText = safeText(feedback.status).toLowerCase();
  const correctTh = safeText(feedback.correct_so_far_th);
  const correctEn = safeText(feedback.correct_so_far_en);
  const issueTh = safeText(feedback.issue_th);
  const issueEn = safeText(feedback.issue_en);
  const hintTh = safeText(feedback.hint_th);
  const hintEn = safeText(feedback.hint_en);
  const fallback = parseWorkerText(data);
  const negative =
    /incorrect|wrong|revise|revision|partial|incomplete|needs?[_ -]?work|error|ผิด|แก้/.test(
      statusText,
    ) || Boolean(issueTh || issueEn);
  const positive =
    /(^|[_ -])(correct|verified|pass|passed|valid|complete|ok)($|[_ -])|ถูก/.test(
      statusText,
    ) || Boolean(correctTh || correctEn);

  return {
    status: negative ? "revision" : positive ? "verified" : "revision",
    rawStatus: statusText,
    confidence: Number.isFinite(Number(feedback.confidence))
      ? Number(feedback.confidence)
      : null,
    feedbackTh: [correctTh && `✓ ${correctTh}`, issueTh && `🔎 ${issueTh}`, hintTh && `💡 ${hintTh}`]
      .filter(Boolean)
      .join("\n\n") || fallback,
    feedbackEn: [correctEn && `✓ ${correctEn}`, issueEn && `🔎 ${issueEn}`, hintEn && `💡 ${hintEn}`]
      .filter(Boolean)
      .join("\n\n") || fallback,
  };
}

function drawNotebookSnapshot(snapshot, targetCanvas = document.createElement("canvas")) {
  const width = Math.max(1, Number(snapshot?.width) || 1400);
  const height = Math.max(1, Number(snapshot?.height) || 900);
  targetCanvas.width = width;
  targetCanvas.height = height;
  const context = targetCanvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#edf2f8";
  context.lineWidth = 1;
  for (let x = 0; x <= width; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  (snapshot?.strokes || []).forEach((stroke) => {
    if (!Array.isArray(stroke.points) || !stroke.points.length) return;
    context.save();
    context.strokeStyle = stroke.color || "#111827";
    context.fillStyle = stroke.color || "#111827";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = Number(stroke.width) || 3.2;
    if (stroke.points.length === 1) {
      const point = stroke.points[0];
      context.beginPath();
      context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let index = 1; index < stroke.points.length - 1; index += 1) {
        const point = stroke.points[index];
        const next = stroke.points[index + 1];
        context.quadraticCurveTo(
          point.x,
          point.y,
          (point.x + next.x) / 2,
          (point.y + next.y) / 2,
        );
      }
      const last = stroke.points[stroke.points.length - 1];
      context.lineTo(last.x, last.y);
      context.stroke();
    }
    context.restore();
  });
  return targetCanvas;
}

function wrapCanvasText(context, text, maximumWidth) {
  const paragraphs = String(text || "").split(/\r?\n/);
  const lines = [];
  paragraphs.forEach((paragraph) => {
    if (!paragraph) {
      lines.push("");
      return;
    }
    const tokens = paragraph.match(/\S+\s*|\s+/g) || [paragraph];
    let line = "";
    tokens.forEach((token) => {
      const candidate = `${line}${token}`;
      if (line && context.measureText(candidate).width > maximumWidth) {
        lines.push(line.trimEnd());
        line = token.trimStart();
        while (line && context.measureText(line).width > maximumWidth) {
          let cut = 1;
          while (
            cut < line.length &&
            context.measureText(line.slice(0, cut + 1)).width <= maximumWidth
          ) {
            cut += 1;
          }
          lines.push(line.slice(0, cut));
          line = line.slice(cut);
        }
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line.trimEnd());
  });
  return lines;
}

function notebookMarkup(questionId) {
  return `
    <section class="notebook-core quiz-notebook-core" data-notebook-core>
      <div class="notebook-toolbar" role="toolbar" aria-label="Notebook tools">
        <div class="notebook-tool-group">
          <button class="notebook-tool-button is-active" type="button" data-notebook-tool="pen" aria-pressed="true" data-label-th="ปากกา" data-label-en="Pen"><span aria-hidden="true">✎</span><b data-th="ปากกา" data-en="Pen">ปากกา</b></button>
          <button class="notebook-tool-button" type="button" data-notebook-tool="eraser" aria-pressed="false" data-label-th="ยางลบ" data-label-en="Eraser"><span aria-hidden="true">◇</span><b data-th="ยางลบ" data-en="Eraser">ยางลบ</b></button>
          <button class="notebook-tool-button" type="button" data-notebook-tool="hand" aria-pressed="false" data-label-th="เลื่อนกระดาษ" data-label-en="Pan page"><span aria-hidden="true">✋</span><b data-th="เลื่อน" data-en="Pan">เลื่อน</b></button>
        </div>
        <span class="notebook-toolbar-divider" aria-hidden="true"></span>
        <div class="notebook-color-group" role="group" aria-label="Pen color">
          <small data-th="สี" data-en="Color">สี</small>
          <button class="notebook-color-button is-active" type="button" data-notebook-color="#111827" data-color-th="สีดำ" data-color-en="Black" aria-label="สีดำ" aria-pressed="true"><span class="color-black" aria-hidden="true"></span></button>
          <button class="notebook-color-button" type="button" data-notebook-color="#2563eb" data-color-th="สีน้ำเงิน" data-color-en="Blue" aria-label="สีน้ำเงิน" aria-pressed="false"><span class="color-blue" aria-hidden="true"></span></button>
          <button class="notebook-color-button" type="button" data-notebook-color="#dc3545" data-color-th="สีแดง" data-color-en="Red" aria-label="สีแดง" aria-pressed="false"><span class="color-red" aria-hidden="true"></span></button>
        </div>
        <span class="notebook-toolbar-divider" aria-hidden="true"></span>
        <button class="notebook-tool-button notebook-finger-button" type="button" data-notebook-finger aria-pressed="false" data-label-th="สลับโหมดนิ้ว" data-label-en="Toggle finger mode"><span aria-hidden="true">☝</span><b data-notebook-finger-label data-th="นิ้ว: เลื่อน" data-en="Finger: pan">นิ้ว: เลื่อน</b></button>
        <span class="notebook-toolbar-divider" aria-hidden="true"></span>
        <div class="notebook-history-group" role="group" aria-label="Writing history">
          <button class="notebook-tool-button" type="button" data-notebook-undo data-label-th="ย้อนการแก้ไขล่าสุด" data-label-en="Undo last change" aria-label="ย้อนกลับ" disabled><span aria-hidden="true">↶</span><b data-th="ย้อนกลับ" data-en="Undo">ย้อนกลับ</b></button>
          <button class="notebook-tool-button" type="button" data-notebook-redo data-label-th="ทำการแก้ไขซ้ำ" data-label-en="Redo last change" aria-label="ทำซ้ำ" disabled><span aria-hidden="true">↷</span><b data-th="ทำซ้ำ" data-en="Redo">ทำซ้ำ</b></button>
        </div>
        <div class="notebook-toolbar-spacer"></div>
        <div class="notebook-zoom-group" aria-label="Zoom controls">
          <button type="button" data-notebook-zoom-out aria-label="Zoom out">−</button>
          <output data-notebook-zoom aria-live="polite">100%</output>
          <button type="button" data-notebook-zoom-in aria-label="Zoom in">+</button>
          <button class="notebook-fit-button" type="button" data-notebook-fit data-label-th="พอดีหน้าต่าง" data-label-en="Fit to window" aria-label="พอดีหน้าต่าง"><span aria-hidden="true">⌗</span><b data-th="พอดี" data-en="Fit">พอดี</b></button>
        </div>
        <button class="notebook-clear-button" type="button" data-notebook-clear data-label-th="ล้างหน้าปัจจุบัน" data-label-en="Clear current page" aria-label="ล้างหน้า"><span aria-hidden="true">⌫</span><b data-th="ล้างหน้า" data-en="Clear">ล้างหน้า</b></button>
      </div>
      <div class="notebook-viewport" data-notebook-viewport>
        <div class="notebook-page" data-notebook-page>
          <canvas data-notebook-canvas width="1400" height="900" tabindex="0" aria-label="Working notebook for ${questionId}"></canvas>
          <div class="notebook-empty-hint" data-notebook-empty><span aria-hidden="true">✎</span><strong data-th="เขียนวิธีทำตรงนี้" data-en="Write your working here">เขียนวิธีทำตรงนี้</strong><small data-th="Apple Pencil ปากกาเมาส์หรือนิ้ว" data-en="Apple Pencil, stylus, mouse, or finger">Apple Pencil ปากกาเมาส์หรือนิ้ว</small></div>
        </div>
      </div>
      <footer class="notebook-statusbar">
        <span class="notebook-live-status" data-notebook-status><i aria-hidden="true"></i><span>พร้อมเขียน</span></span>
        <code data-notebook-page-key>${questionId} / page-001</code>
      </footer>
    </section>`;
}

export class QuizEvidenceManager {
  constructor(options) {
    this.contentId = options.contentId;
    this.identityKey = options.identityKey || "guest";
    this.questions = options.questions || [];
    this.language = options.language;
    this.onChange = options.onChange || (() => {});
    this.workerUrl = options.workerUrl || AI_WORKER_FALLBACK;
    this.state = this.emptyState();
    this.memory = new Map();
    this.current = null;
    this.loadToken = 0;
    this.saveTimers = new Map();
  }

  emptyState() {
    return {
      schema: EVIDENCE_SCHEMA,
      entries: {},
      globalRevision: 0,
      submissionRevision: 0,
      lastSubmittedAt: 0,
      exportMeta: null,
    };
  }

  setIdentity(identityKey) {
    this.flushCurrent();
    this.identityKey = identityKey || "guest";
    this.memory.clear();
  }

  reset() {
    this.unmount();
    this.state = this.emptyState();
    this.memory.clear();
  }

  restore(saved, { merge = false } = {}) {
    if (!saved || saved.schema !== EVIDENCE_SCHEMA) {
      if (!merge) this.state = this.emptyState();
      return;
    }
    if (!merge) {
      this.state = {
        ...this.emptyState(),
        ...clone(saved),
        entries: clone(saved.entries || {}),
      };
      return;
    }

    Object.entries(saved.entries || {}).forEach(([questionId, incoming]) => {
      const current = this.entry(questionId);
      if (Number(incoming?.review?.checkedAt || 0) > Number(current.review?.checkedAt || 0)) {
        current.review = clone(incoming.review);
      }
    });
    if (
      Number(saved.exportMeta?.exportedAt || 0) >
      Number(this.state.exportMeta?.exportedAt || 0)
    ) {
      this.state.exportMeta = clone(saved.exportMeta);
    }
  }

  serializeLocal() {
    return clone(this.state);
  }

  serializeCloud() {
    const entries = {};
    Object.entries(this.state.entries).forEach(([questionId, entry]) => {
      if (!entry.review) return;
      entries[questionId] = {
        review: {
          status: entry.review.status,
          checkedAt: entry.review.checkedAt || 0,
          verificationId: entry.review.verificationId || "",
          evidenceRevision: entry.review.evidenceRevision || 0,
        },
      };
    });
    return {
      schema: EVIDENCE_SCHEMA,
      entries,
      globalRevision: this.state.globalRevision,
      submissionRevision: this.state.submissionRevision,
      lastSubmittedAt: this.state.lastSubmittedAt,
      exportMeta: this.state.exportMeta ? { ...this.state.exportMeta } : null,
    };
  }

  entry(questionId) {
    if (!this.state.entries[questionId]) {
      this.state.entries[questionId] = {
        reasoning: "",
        revision: 0,
        notebook: { strokeCount: 0, revision: 0 },
        review: null,
      };
    }
    return this.state.entries[questionId];
  }

  notebookKey(questionId) {
    return `v1:${this.identityKey}:${this.contentId}:${questionId}`;
  }

  hasEvidence(questionId) {
    const entry = this.entry(questionId);
    return Boolean(entry.reasoning?.trim()) || Number(entry.notebook?.strokeCount || 0) > 0;
  }

  evidenceCount() {
    return this.questions.filter((question) => this.hasEvidence(question.id)).length;
  }

  missingForAnswered(results) {
    return results
      .filter((result) => result.status !== "unanswered" && !this.hasEvidence(result.question.id))
      .map((result) => result.question);
  }

  markChanged(questionId, kind) {
    const entry = this.entry(questionId);
    entry.revision += 1;
    this.state.globalRevision += 1;
    if (entry.review && entry.review.status !== "awaiting") {
      entry.review = {
        ...entry.review,
        previousStatus: entry.review.status,
        status: "recheck",
      };
    }
    this.state.exportMeta = this.state.exportMeta
      ? { ...this.state.exportMeta, stale: true }
      : null;
    this.updateCurrentUi();
    this.onChange({ type: "evidence", questionId, kind });
  }

  markContextChanged(questionId) {
    const entry = this.entry(questionId);
    if (!entry.review) return;
    entry.revision += 1;
    this.state.globalRevision += 1;
    entry.review = {
      ...entry.review,
      previousStatus: entry.review.status,
      status: "recheck",
    };
    if (this.state.exportMeta) this.state.exportMeta.stale = true;
    this.updateCurrentUi();
    this.onChange({ type: "evidence", questionId, kind: "answer-context" });
  }

  async readNotebook(questionId) {
    if (this.memory.has(questionId)) return clone(this.memory.get(questionId));
    const saved = await notebookRecord("get", this.notebookKey(questionId));
    if (saved) this.memory.set(questionId, saved);
    return clone(saved);
  }

  persistNotebookSnapshot(recordKey, snapshot) {
    const strokeCount = Array.isArray(snapshot?.strokes) ? snapshot.strokes.length : 0;
    if (strokeCount > 0) {
      return notebookRecord("put", recordKey, clone(snapshot));
    }
    return notebookRecord("delete", recordKey);
  }

  saveNotebookSnapshot(questionId, snapshot, { changed = false, immediate = false } = {}) {
    if (!snapshot) return;
    this.memory.set(questionId, clone(snapshot));
    const entry = this.entry(questionId);
    const strokeCount = Array.isArray(snapshot.strokes) ? snapshot.strokes.length : 0;
    entry.notebook = {
      strokeCount,
      revision: Math.max(0, Number(snapshot.revision) || 0),
    };
    if (changed) this.markChanged(questionId, "notebook");

    const recordKey = this.notebookKey(questionId);
    clearTimeout(this.saveTimers.get(recordKey));
    this.saveTimers.delete(recordKey);
    if (immediate) {
      void this.persistNotebookSnapshot(recordKey, snapshot);
      return;
    }
    const timer = setTimeout(() => {
      this.saveTimers.delete(recordKey);
      void this.persistNotebookSnapshot(recordKey, snapshot);
    }, changed ? 500 : 0);
    this.saveTimers.set(recordKey, timer);
  }

  flushCurrent() {
    if (!this.current?.notebook || !this.current.questionId) return;
    this.saveNotebookSnapshot(
      this.current.questionId,
      this.current.notebook.exportSnapshot(),
      { immediate: true },
    );
  }

  unmount() {
    this.loadToken += 1;
    this.flushCurrent();
    this.current?.notebook?.destroy?.();
    this.current = null;
  }

  mount(container, question) {
    if (!container || !question) return;
    this.unmount();
    const entry = this.entry(question.id);
    container.innerHTML = `
      <section class="quiz-reasoning-card">
        <header class="quiz-evidence-heading">
          <div>
            <strong>${this.language() === "en" ? "Reasoning and AI review" : "เหตุผลและ AI ตรวจวิธีทำ"}</strong>
            <small>${this.language() === "en" ? "Type your reasoning, write in the notebook, or use both." : "พิมพ์เหตุผล เขียนในสมุดทด หรือใช้ทั้งสองแบบ"}</small>
          </div>
          <span class="quiz-evidence-badge" data-evidence-badge></span>
        </header>
        <label class="quiz-reasoning-field">
          <span>${this.language() === "en" ? "Explain your reasoning" : "อธิบายเหตุผลหรือวิธีคิด"}</span>
          <textarea data-reasoning-input rows="4" maxlength="6000" placeholder="${this.language() === "en" ? "Write the important steps or explain why you chose this answer…" : "เขียนขั้นสำคัญ หรืออธิบายว่าทำไมจึงเลือกคำตอบนี้…"}"></textarea>
          <small><span data-reasoning-count>0</span>/6000</small>
        </label>
        <details class="quiz-notebook-panel" data-notebook-panel>
          <summary>
            <span><b>✎ ${this.language() === "en" ? "Working notebook" : "สมุดทด"}</b><small>${this.language() === "en" ? "Writing is kept on this device and separated by question." : "ลายมือเก็บในเครื่องนี้และแยกตามข้อ"}</small></span>
            <span data-notebook-evidence-status></span>
          </summary>
          <div data-notebook-mount><p class="quiz-notebook-loading">${this.language() === "en" ? "Open the notebook to start writing." : "เปิดสมุดเพื่อเริ่มเขียน"}</p></div>
        </details>
        <div class="quiz-evidence-milestone" data-evidence-milestone hidden></div>
        <div class="quiz-ai-review-card" data-ai-review-card>
          <div class="quiz-ai-review-main">
            <span class="quiz-ai-status" data-ai-status></span>
            <p data-ai-feedback></p>
          </div>
          <button type="button" class="quiz-ai-check-button" data-ai-check>${this.language() === "en" ? "Check this reasoning" : "ให้ AI ตรวจวิธีทำข้อนี้"}</button>
        </div>
      </section>`;

    const textarea = container.querySelector("[data-reasoning-input]");
    textarea.value = entry.reasoning || "";
    const updateReasoningCount = () => {
      container.querySelector("[data-reasoning-count]").textContent = String(textarea.value.length);
    };
    updateReasoningCount();
    textarea.addEventListener("input", () => {
      if (entry.reasoning === textarea.value) return;
      entry.reasoning = textarea.value;
      updateReasoningCount();
      this.markChanged(question.id, "reasoning");
    });

    const panel = container.querySelector("[data-notebook-panel]");
    panel.addEventListener("toggle", () => {
      if (panel.open) void this.mountNotebook(container, question);
    });
    container.querySelector("[data-ai-check]").addEventListener("click", () => {
      void this.checkQuestion(question, { notifyMissing: true });
    });
    this.current = { container, questionId: question.id, notebook: null };
    this.updateCurrentUi();
  }

  async mountNotebook(container, question) {
    if (this.current?.questionId !== question.id || this.current.notebook) return;
    const token = ++this.loadToken;
    const mount = container.querySelector("[data-notebook-mount]");
    mount.innerHTML = notebookMarkup(question.id);
    const root = mount.querySelector("[data-notebook-core]");
    const context = {
      contentId: this.contentId,
      itemId: question.id,
      pageId: "page-001",
      toolKind: "notebook",
    };
    const notebook = new NotebookCore(root, { context });
    this.current.notebook = notebook;
    const saved = await this.readNotebook(question.id);
    if (token !== this.loadToken || this.current?.questionId !== question.id) {
      notebook.destroy();
      return;
    }
    notebook.loadSnapshot(saved || { context, strokes: [] });
    notebook.setContext(context);
    root.addEventListener("notebook-core-change", () => {
      this.saveNotebookSnapshot(question.id, notebook.exportSnapshot(), { changed: true });
    });
    requestAnimationFrame(() => notebook.fitToViewport());
    this.updateCurrentUi();
  }

  updateCurrentUi() {
    const current = this.current;
    if (!current?.container) return;
    const entry = this.entry(current.questionId);
    const hasReasoning = Boolean(entry.reasoning?.trim());
    const hasInk = Number(entry.notebook?.strokeCount || 0) > 0;
    const badge = current.container.querySelector("[data-evidence-badge]");
    const notebookStatus = current.container.querySelector("[data-notebook-evidence-status]");
    const status = current.container.querySelector("[data-ai-status]");
    const feedback = current.container.querySelector("[data-ai-feedback]");
    const checkButton = current.container.querySelector("[data-ai-check]");
    const milestone = current.container.querySelector("[data-evidence-milestone]");

    badge.dataset.tone = hasReasoning || hasInk ? "ready" : "missing";
    badge.textContent =
      hasReasoning || hasInk
        ? this.language() === "en"
          ? "Evidence ready"
          : "มีหลักฐานแล้ว"
        : this.language() === "en"
          ? "No reasoning yet"
          : "ยังไม่มีเหตุผล/กระดาษทด";
    notebookStatus.textContent = hasInk
      ? this.language() === "en"
        ? `${entry.notebook.strokeCount} strokes`
        : `${entry.notebook.strokeCount} เส้น`
      : this.language() === "en"
        ? "No writing"
        : "ยังไม่มีลายมือ";

    const review = entry.review;
    const statusCopy = {
      awaiting: ["AI กำลังตรวจ…", "AI is checking…"],
      verified: ["AI ยืนยันวิธีคิดแล้ว", "Reasoning verified by AI"],
      revision: ["AI แนะนำให้แก้วิธีคิด", "Reasoning needs revision"],
      unavailable: ["AI ยังตรวจไม่ได้", "AI unavailable"],
      "no-reasoning": ["ไม่มีวิธีคิดให้ตรวจ", "No reasoning to review"],
      recheck: ["แก้ไขแล้ว ต้องตรวจใหม่", "Edited — recheck required"],
    }[review?.status] || ["รอ AI ตรวจ", "Awaiting AI check"];
    status.dataset.status = review?.status || "idle";
    status.textContent = this.language() === "en" ? statusCopy[1] : statusCopy[0];
    feedback.textContent =
      (this.language() === "en" ? review?.feedbackEn : review?.feedbackTh) ||
      review?.error ||
      (this.language() === "en"
        ? "AI checks the method independently; the Quiz Engine still grades the final answer."
        : "AI ตรวจวิธีคิดแยกจากกัน ส่วนคำตอบสุดท้าย Quiz Engine เป็นผู้ตรวจ");
    checkButton.disabled = review?.status === "awaiting";
    checkButton.textContent =
      review?.status === "awaiting"
        ? this.language() === "en"
          ? "Checking…"
          : "กำลังตรวจ…"
        : review
          ? this.language() === "en"
            ? "Check again"
            : "ตรวจอีกครั้ง"
          : this.language() === "en"
            ? "Check this reasoning"
            : "ให้ AI ตรวจวิธีทำข้อนี้";

    const count = this.evidenceCount();
    milestone.hidden = count < 20 || !this.needsExport();
    if (!milestone.hidden) {
      milestone.textContent =
        this.language() === "en"
          ? `You now have working evidence for ${count} questions. Export a PDF checkpoint soon.`
          : `ตอนนี้มีหลักฐานวิธีทำแล้ว ${count} ข้อ ควรส่งออก PDF เก็บเป็นจุดพักงาน`;
    }
  }

  async evidenceSnapshot(questionId) {
    if (this.current?.questionId === questionId && this.current.notebook) {
      this.flushCurrent();
    }
    return this.readNotebook(questionId);
  }

  async evidenceImage(question) {
    const entry = this.entry(question.id);
    const snapshot = await this.evidenceSnapshot(question.id);
    const reason = entry.reasoning?.trim() || "";
    const canvas = document.createElement("canvas");
    const width = 1400;
    const context = canvas.getContext("2d");
    context.font = '28px "Noto Sans Thai", Tahoma, Arial, sans-serif';
    const reasonLines = wrapCanvasText(context, reason || "(No typed reasoning)", width - 112);
    const reasonHeight = Math.max(180, 130 + reasonLines.length * 42);
    const hasInk = Array.isArray(snapshot?.strokes) && snapshot.strokes.length > 0;
    canvas.width = width;
    canvas.height = reasonHeight + (hasInk ? 900 : 0);
    const draw = canvas.getContext("2d", { alpha: false });
    draw.fillStyle = "#ffffff";
    draw.fillRect(0, 0, canvas.width, canvas.height);
    draw.fillStyle = "#172554";
    draw.font = '700 32px "Noto Sans Thai", Tahoma, Arial, sans-serif';
    draw.fillText(`Q${question.index + 1} · Student reasoning`, 56, 58);
    draw.fillStyle = "#334155";
    draw.font = '26px "Noto Sans Thai", Tahoma, Arial, sans-serif';
    reasonLines.forEach((line, index) => draw.fillText(line, 56, 112 + index * 42));
    if (hasInk) {
      const notebookCanvas = drawNotebookSnapshot(snapshot);
      draw.drawImage(notebookCanvas, 0, reasonHeight, width, 900);
    }
    return canvas.toDataURL("image/jpeg", 0.9).replace(/^data:image\/jpeg;base64,/, "");
  }

  questionPayload(question) {
    const answer = this.getAnswer?.(question.id) || "";
    const optionLines = question.options
      .map((option) => `${option.dataset.choiceId}: ${safeText(option.textContent)}`)
      .join("\n");
    const prompt = safeText(question.prompt?.textContent);
    const selected = selectedOptionText(question, answer);
    const referenceSolution = safeText(question.solution?.textContent);
    const policy =
      "Review the student's reasoning directly and concisely. Do not change the deterministic final-answer score. Return whether the reasoning is correct or needs revision, plus specific feedback in Thai and English. Before Give Up, do not reveal the final correct option or exact final answer.";
    return {
      mode: "image_check",
      question: `${prompt}\nChoices:\n${optionLines}\nStudent selected: ${answer}${selected ? ` — ${selected}` : ""}`,
      referenceSolution,
      selectedAnswer: answer,
      hintLevel: Number(this.getHintLevel?.(question.id) || 0),
      giveUp: Boolean(this.getGiveUp?.(question.id)),
      studentReasoning: this.entry(question.id).reasoning || "",
      tutorPolicy: policy,
      systemInstruction: policy,
    };
  }

  configureContextAccessors(accessors = {}) {
    this.getAnswer = accessors.getAnswer;
    this.getHintLevel = accessors.getHintLevel;
    this.getGiveUp = accessors.getGiveUp;
  }

  async checkQuestion(question, { notifyMissing = false } = {}) {
    this.flushCurrent();
    const entry = this.entry(question.id);
    if (!this.hasEvidence(question.id)) {
      entry.review = {
        status: "no-reasoning",
        checkedAt: Date.now(),
        evidenceRevision: entry.revision,
      };
      this.updateCurrentUi();
      this.onChange({ type: "review", questionId: question.id });
      if (notifyMissing) {
        window.alert(
          this.language() === "en"
            ? "There is no typed reasoning or notebook writing for AI to review."
            : "ข้อนี้ยังไม่มีเหตุผลหรือกระดาษทด จึงยังไม่มีวิธีทำให้ AI ตรวจ",
        );
      }
      return { ok: false, noEvidence: true };
    }

    const sentRevision = entry.revision;
    entry.review = {
      status: "awaiting",
      checkedAt: 0,
      evidenceRevision: sentRevision,
    };
    this.updateCurrentUi();
    this.onChange({ type: "review", questionId: question.id });

    try {
      const imageBase64 = await this.evidenceImage(question);
      const response = await fetch(this.workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...this.questionPayload(question),
          imageBase64,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const requestError = new Error(
          data?.error || data?.detail || `HTTP ${response.status}`,
        );
        requestError.status = response.status;
        throw requestError;
      }
      const normalized = normalizeWorkerReview(data);
      entry.review =
        entry.revision === sentRevision
          ? {
              ...normalized,
              checkedAt: Date.now(),
              evidenceRevision: sentRevision,
              verificationId: createVerificationId(),
            }
          : {
              ...normalized,
              previousStatus: normalized.status,
              status: "recheck",
              checkedAt: Date.now(),
              evidenceRevision: sentRevision,
              verificationId: createVerificationId(),
            };
      this.updateCurrentUi();
      this.onChange({ type: "review", questionId: question.id });
      return { ok: true, review: entry.review };
    } catch (error) {
      const message = safeText(error?.message || error || "AI review failed");
      entry.review = {
        status: "unavailable",
        checkedAt: Date.now(),
        evidenceRevision: sentRevision,
        verificationId: createVerificationId(),
        error:
          this.language() === "en"
            ? `AI could not verify this reasoning: ${message}`
            : `AI ยังยืนยันวิธีคิดนี้ไม่ได้: ${message}`,
      };
      this.updateCurrentUi();
      this.onChange({ type: "review", questionId: question.id });
      return {
        ok: false,
        unavailable: true,
        rateLimited:
          Number(error?.status) === 429 || /limit|quota|too many/i.test(message),
      };
    }
  }

  needsReview(questionId) {
    if (!this.hasEvidence(questionId)) return false;
    const entry = this.entry(questionId);
    return (
      !entry.review ||
      entry.review.status === "awaiting" ||
      entry.review.status === "recheck" ||
      entry.review.status === "unavailable" ||
      Number(entry.review.evidenceRevision || -1) !== Number(entry.revision)
    );
  }

  async reviewPending(questions, onProgress = () => {}) {
    const pending = questions.filter((question) => this.needsReview(question.id));
    for (let index = 0; index < pending.length; index += 1) {
      const question = pending[index];
      onProgress({ current: index + 1, total: pending.length, question });
      const result = await this.checkQuestion(question);
      if (result.rateLimited) {
        pending.slice(index + 1).forEach((remaining) => {
          const entry = this.entry(remaining.id);
          entry.review = {
            status: "unavailable",
            checkedAt: Date.now(),
            evidenceRevision: entry.revision,
            verificationId: createVerificationId(),
            error:
              this.language() === "en"
                ? "AI limit reached. The final answer can still be graded, but the reasoning is not verified."
                : "AI ถึงขีดจำกัดแล้ว ระบบยังตรวจคำตอบสุดท้ายได้ แต่วิธีคิดยังไม่ได้รับการยืนยัน",
          };
        });
        this.onChange({ type: "review-batch-limited" });
        break;
      }
    }
    onProgress({ current: pending.length, total: pending.length, done: true });
  }

  noteSubmission(results) {
    this.flushCurrent();
    this.state.submissionRevision += 1;
    this.state.lastSubmittedAt = Date.now();
    this.missingForAnswered(results).forEach((question) => {
      const entry = this.entry(question.id);
      entry.review = {
        status: "no-reasoning",
        checkedAt: Date.now(),
        evidenceRevision: entry.revision,
      };
    });
    if (this.state.exportMeta) this.state.exportMeta.stale = true;
    this.onChange({ type: "submission" });
  }

  needsExport() {
    if (!this.state.submissionRevision) return false;
    const exported = this.state.exportMeta;
    return (
      !exported ||
      exported.stale === true ||
      Number(exported.submissionRevision) !== Number(this.state.submissionRevision) ||
      Number(exported.evidenceRevision) !== Number(this.state.globalRevision)
    );
  }

  statusFor(questionId, objectiveStatus) {
    const entry = this.entry(questionId);
    const reviewStatus = this.hasEvidence(questionId)
      ? entry.review?.status || "awaiting"
      : "no-reasoning";
    const correct = objectiveStatus === "correct";
    const configs = {
      "no-reasoning": {
        kind: "no-reasoning",
        symbol: "—",
        th: "ไม่มีเหตุผลหรือกระดาษทด",
        en: "NO REASONING PROVIDED",
      },
      awaiting: {
        kind: "awaiting",
        symbol: "…",
        th: "รอ AI ตรวจ",
        en: "AWAITING AI CHECK",
      },
      recheck: {
        kind: "recheck",
        symbol: "↻",
        th: "แก้ไขแล้ว ต้องตรวจใหม่",
        en: "RECHECK REQUIRED",
      },
      unavailable: {
        kind: "unavailable",
        symbol: "!",
        th: correct ? "คำตอบถูก · AI ยังไม่ยืนยันวิธีคิด" : "AI ยังตรวจวิธีคิดไม่ได้",
        en: correct ? "ANSWER CORRECT · AI NOT VERIFIED" : "AI UNAVAILABLE",
      },
      revision: {
        kind: "revision",
        symbol: "△",
        th: correct ? "คำตอบถูก · วิธีคิดควรแก้" : "คำตอบผิด · มีคำแนะนำจาก AI",
        en: correct
          ? "ANSWER CORRECT · REASONING NEEDS REVISION"
          : "ANSWER WRONG · AI FEEDBACK",
      },
      verified: {
        kind: correct ? "verified" : "revision",
        symbol: correct ? "✓" : "△",
        th: correct ? "คำตอบถูก · AI ยืนยันวิธีคิด" : "คำตอบผิด · มีคำแนะนำจาก AI",
        en: correct ? "ANSWER CORRECT · AI VERIFIED" : "ANSWER WRONG · AI FEEDBACK",
      },
    };
    return configs[reviewStatus] || configs.awaiting;
  }

  async snapshotImageUrl(questionId) {
    const snapshot = await this.evidenceSnapshot(questionId);
    if (!snapshot?.strokes?.length) return "";
    return drawNotebookSnapshot(snapshot).toDataURL("image/jpeg", 0.88);
  }

  async buildCoverPage({ title, results, part, partCount }) {
    const page = document.createElement("section");
    page.className = "quiz-evidence-export-page is-cover";
    const answered = results.filter((result) => result.status !== "unanswered");
    const missing = this.missingForAnswered(results);
    const verified = results.filter(
      (result) => this.entry(result.question.id).review?.status === "verified",
    );
    const heading = document.createElement("div");
    heading.className = "quiz-evidence-export-cover-heading";
    heading.innerHTML = `<small>LEARNING HUB · REASONING EVIDENCE</small><h1></h1><p></p>`;
    heading.querySelector("h1").textContent = title;
    heading.querySelector("p").textContent =
      partCount > 1
        ? `${this.language() === "en" ? "PDF part" : "ไฟล์ส่วนที่"} ${part}/${partCount}`
        : this.language() === "en"
          ? "Quiz evidence report"
          : "รายงานหลักฐานการทำ Quiz";
    const stats = document.createElement("div");
    stats.className = "quiz-evidence-export-stats";
    [
      [answered.length, this.language() === "en" ? "Answered" : "ตอบแล้ว"],
      [this.evidenceCount(), this.language() === "en" ? "With evidence" : "มีวิธีทำ"],
      [verified.length, this.language() === "en" ? "AI verified" : "AI ยืนยันแล้ว"],
      [missing.length, this.language() === "en" ? "No reasoning" : "ไม่มีเหตุผล/กระดาษทด"],
    ].forEach(([value, copy]) => {
      const card = document.createElement("article");
      card.innerHTML = `<strong>${value}</strong><span></span>`;
      card.querySelector("span").textContent = copy;
      stats.append(card);
    });
    const note = document.createElement("div");
    note.className = `quiz-evidence-export-cover-note ${missing.length ? "has-warning" : "is-complete"}`;
    const missingNumbers = missing.map((question) => `Q${question.index + 1}`);
    note.innerHTML = `<strong></strong><p></p>`;
    note.querySelector("strong").textContent = missing.length
      ? this.language() === "en"
        ? "NO REASONING PROVIDED"
        : "พบข้อที่ไม่มีเหตุผลหรือกระดาษทด"
      : this.language() === "en"
        ? "EVIDENCE READY"
        : "มีหลักฐานพร้อมส่งออก";
    note.querySelector("p").textContent = missing.length
      ? `${missingNumbers.slice(0, 60).join(", ")}${missingNumbers.length > 60 ? ` +${missingNumbers.length - 60}` : ""}`
      : this.language() === "en"
        ? "Every answered question includes typed reasoning or notebook writing."
        : "ทุกข้อที่ตอบมีข้อความเหตุผลหรือลายมือในสมุดทด";
    const meta = document.createElement("footer");
    meta.textContent = `${new Date().toLocaleString(this.language() === "en" ? "en-GB" : "th-TH")} · ${this.contentId}`;
    page.append(heading, stats, note, meta);
    return page;
  }

  async buildQuestionPage({ title, result }) {
    const question = result.question;
    const entry = this.entry(question.id);
    const stamp = this.statusFor(question.id, result.status);
    const page = document.createElement("section");
    page.className = "quiz-evidence-export-page";
    const header = document.createElement("header");
    header.innerHTML = `<div><small>LEARNING HUB · ${this.contentId}</small><h1></h1></div><span>Q${question.index + 1}</span>`;
    header.querySelector("h1").textContent = title;
    const stampBox = document.createElement("section");
    stampBox.className = `quiz-evidence-export-stamp is-${stamp.kind}`;
    stampBox.innerHTML = `<b>${stamp.symbol}</b><div><strong></strong><span></span></div>`;
    stampBox.querySelector("strong").textContent =
      this.language() === "en" ? stamp.en : stamp.th;
    stampBox.querySelector("span").textContent = [
      entry.review?.verificationId,
      entry.review?.checkedAt
        ? new Date(entry.review.checkedAt).toLocaleString(
            this.language() === "en" ? "en-GB" : "th-TH",
          )
        : "",
    ]
      .filter(Boolean)
      .join(" · ");
    const prompt = document.createElement("section");
    prompt.className = "quiz-evidence-export-prompt";
    prompt.innerHTML = `<small>${this.language() === "en" ? "QUESTION" : "โจทย์"}</small>`;
    const promptCopy = activeLanguageNode(question.prompt, this.language())?.cloneNode(true);
    if (promptCopy) prompt.append(promptCopy);
    const answer = document.createElement("p");
    answer.className = "quiz-evidence-export-answer";
    answer.textContent = `${this.language() === "en" ? "Selected answer" : "คำตอบที่เลือก"}: ${selectedOptionText(question, this.getAnswer?.(question.id)) || "—"}`;
    const reason = document.createElement("section");
    reason.className = "quiz-evidence-export-reason";
    reason.innerHTML = `<small>${this.language() === "en" ? "TYPED REASONING" : "เหตุผลที่พิมพ์"}</small><p></p>`;
    reason.querySelector("p").textContent =
      entry.reasoning?.trim() ||
      (this.language() === "en" ? "No typed reasoning provided." : "ไม่ได้พิมพ์เหตุผล");
    const notebookUrl = await this.snapshotImageUrl(question.id);
    const notebook = document.createElement("section");
    notebook.className = "quiz-evidence-export-notebook";
    notebook.innerHTML = `<small>${this.language() === "en" ? "WORKING NOTEBOOK" : "สมุดทด"}</small>`;
    if (notebookUrl) {
      const image = document.createElement("img");
      image.src = notebookUrl;
      image.alt = `Notebook Q${question.index + 1}`;
      notebook.append(image);
    } else {
      const empty = document.createElement("p");
      empty.textContent = this.language() === "en" ? "No notebook writing." : "ไม่มีลายมือในสมุดทด";
      notebook.append(empty);
    }
    const feedback = document.createElement("section");
    feedback.className = "quiz-evidence-export-feedback";
    feedback.innerHTML = `<small>${this.language() === "en" ? "AI FEEDBACK" : "คำแนะนำจาก AI"}</small><p></p>`;
    feedback.querySelector("p").textContent =
      (this.language() === "en" ? entry.review?.feedbackEn : entry.review?.feedbackTh) ||
      entry.review?.error ||
      (this.language() === "en" ? "Reasoning was not verified." : "วิธีคิดยังไม่ได้รับการยืนยัน");
    page.append(header, stampBox, prompt, answer, reason, notebook, feedback);
    return page;
  }

  async renderPdfPage(page, pdf, addPage) {
    const host = document.querySelector("[data-evidence-export-host]") || document.body;
    host.replaceChildren(page);
    try {
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([page]).catch(() => {});
      }
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const pageRect = page.getBoundingClientRect();
      const headerTitle = page.querySelector(":scope > header > div");
      const headerRect = headerTitle?.getBoundingClientRect();
      const headerShot = headerTitle
        ? await window.html2canvas(headerTitle, {
            scale: 1.1,
            backgroundColor: null,
            useCORS: true,
            logging: false,
          })
        : null;
      const shot = await window.html2canvas(page, {
        scale: 1.1,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      if (headerShot && headerRect) {
        const scale = shot.width / pageRect.width;
        const x = (headerRect.left - pageRect.left) * scale;
        const y = (headerRect.top - pageRect.top) * scale;
        const context = shot.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(x, y, headerShot.width, headerShot.height);
        context.drawImage(headerShot, x, y);
      }
      const data = shot.toDataURL("image/jpeg", 0.86);
      if (addPage) pdf.addPage("a4", "portrait");
      pdf.addImage(data, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    } finally {
      host.replaceChildren();
    }
  }

  async exportPdf({ title, results, onProgress = () => {} }) {
    this.flushCurrent();
    if (!window.html2canvas || !window.jspdf?.jsPDF) {
      throw new Error(
        this.language() === "en"
          ? "PDF tools are still loading. Please try again."
          : "เครื่องมือ PDF ยังโหลดไม่เสร็จ กรุณาลองอีกครั้ง",
      );
    }
    const evidenceResults = results.filter((result) => this.hasEvidence(result.question.id));
    const groups = [];
    if (!evidenceResults.length) groups.push([]);
    for (let index = 0; index < evidenceResults.length; index += PDF_PAGE_LIMIT) {
      groups.push(evidenceResults.slice(index, index + PDF_PAGE_LIMIT));
    }
    const fileNames = [];
    let completedPages = 0;
    const totalPages = groups.reduce((sum, group) => sum + group.length + 1, 0);
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
      const group = groups[groupIndex];
      const pdf = new window.jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const cover = await this.buildCoverPage({
        title,
        results,
        part: groupIndex + 1,
        partCount: groups.length,
      });
      await this.renderPdfPage(cover, pdf, false);
      completedPages += 1;
      onProgress({ current: completedPages, total: totalPages });
      for (const result of group) {
        const page = await this.buildQuestionPage({ title, result });
        await this.renderPdfPage(page, pdf, true);
        completedPages += 1;
        onProgress({ current: completedPages, total: totalPages });
      }
      const suffix = groups.length > 1 ? `_part-${groupIndex + 1}-of-${groups.length}` : "";
      const fileName = `${this.contentId}_reasoning-evidence${suffix}.pdf`.replace(
        /[^a-z0-9_.-]/gi,
        "-",
      );
      pdf.save(fileName);
      fileNames.push(fileName);
    }
    this.state.exportMeta = {
      exportedAt: Date.now(),
      evidenceRevision: this.state.globalRevision,
      submissionRevision: this.state.submissionRevision,
      exportedQuestionCount: evidenceResults.length,
      fileCount: fileNames.length,
      stale: false,
    };
    this.updateCurrentUi();
    this.onChange({ type: "export", fileNames });
    return fileNames;
  }
}
