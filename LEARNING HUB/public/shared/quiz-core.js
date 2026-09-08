import { QuizEvidenceManager } from "./quiz-evidence.js";

/* ==============================================================
   Quiz Engine กลางของ Learning Hub
   ไฟล์เนื้อหามีเฉพาะสรุป โจทย์ Hint และเฉลย ส่วนพฤติกรรมอยู่ที่นี่
================================================================ */

(function initializeLearningHubQuiz() {
  if (window.LearningHubQuiz) return;

  const shell = document.querySelector("[data-quiz-shell]");
  const app = document.querySelector("[data-quiz-app]");
  const loading = document.querySelector("[data-quiz-loading]");
  const errorBox = document.querySelector("[data-quiz-error]");
  const printSource = document.querySelector("[data-quiz-print-source]");
  const summaryDialog = document.querySelector("[data-summary-dialog]");
  const summaryContent = document.querySelector("[data-summary-content]");
  const summaryTitle = document.querySelector("[data-summary-title]");
  const printPanel = document.querySelector("[data-print-selection-panel]");
  const printToggle = document.querySelector("[data-print-selection-toggle]");
  const pendingStorageRequests = new Map();

  if (!shell || !app || !loading || !printSource) return;

  const state = {
    contentId: "",
    questions: [],
    currentIndex: 0,
    answers: {},
    giveUps: {},
    hintLevels: {},
    masteredIds: [],
    attempt: 1,
    view: "exam",
    startedAt: Date.now(),
    elapsedBeforeMs: 0,
    latestScore: null,
    savedAt: 0,
    storageStatus: "local",
    identityKey: "guest",
    evidenceSnapshot: null,
  };

  let contentRoot = null;
  let timerHandle = null;
  let localSaveHandle = null;
  let cloudSaveHandle = null;
  let evidenceManager = null;
  let submissionBusy = false;

  function language() {
    return document.documentElement.lang === "en" ? "en" : "th";
  }

  function label(thai, english) {
    return language() === "en" ? english : thai;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function resolveContentSource() {
    const params = new URLSearchParams(location.search);
    return params.get("content") || shell.dataset.contentSrc;
  }

  function currentQuestion() {
    return state.questions[state.currentIndex] || null;
  }

  function elapsedMs() {
    return state.elapsedBeforeMs + Math.max(0, Date.now() - state.startedAt);
  }

  function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function questionStatus(question) {
    if (state.masteredIds.includes(question.id)) return "mastered";
    if (state.giveUps[question.id]) return "giveup";
    if (state.answers[question.id]) return "answered";
    return "empty";
  }

  function readQuestions(root) {
    return [...root.querySelectorAll("[data-question]")].map((element, index) => ({
      id: element.dataset.questionId,
      index,
      answer: element.dataset.answer,
      element,
      prompt: element.querySelector("[data-question-prompt]"),
      context: element.querySelector("[data-question-context]"),
      options: [...element.querySelectorAll("[data-choice-id]")],
      hints: [...element.querySelectorAll("[data-question-hint]")],
      solution: element.querySelector("[data-question-solution]"),
    }));
  }

  function validateContent(root) {
    const errors = [];
    if (!root) errors.push("Missing data-learning-activity-content.");
    if (root?.dataset.activityKind !== "quiz") errors.push("Content is not a quiz.");
    if (!root?.dataset.activityId) errors.push("Missing stable quiz id.");
    const questions = root ? readQuestions(root) : [];
    if (!questions.length) errors.push("No questions found.");
    questions.forEach((question, index) => {
      if (!question.id || !question.prompt) errors.push(`Question ${index + 1} is incomplete.`);
      if (question.options.length < 2) errors.push(`Question ${index + 1} needs choices.`);
      if (!question.options.some((option) => option.dataset.choiceId === question.answer)) {
        errors.push(`Question ${index + 1} has no matching answer.`);
      }
    });
    return { errors, questions };
  }

  function preparePrintSource(root) {
    root.classList.add("activity-content", "quiz-print-content");
    root.querySelector("[data-activity-intro]")?.classList.add("activity-intro");
    root.querySelector("[data-activity-summary]")?.classList.add("activity-summary");
    root.querySelector("[data-activity-questions]")?.classList.add("activity-questions");
    root.querySelectorAll("[data-question]").forEach((question, index) => {
      question.classList.add("activity-question");
      question.dataset.printIndex = String(index + 1);
      question.querySelector("[data-question-solution]")?.classList.add("activity-question-solution");
    });
  }

  function storageKey() {
    return `learning-hub-quiz:v1:${state.identityKey}:${state.contentId}`;
  }

  function snapshot({ includeLocalEvidence = false } = {}) {
    return {
      version: 2,
      answers: { ...state.answers },
      giveUps: { ...state.giveUps },
      hintLevels: { ...state.hintLevels },
      masteredIds: [...state.masteredIds],
      currentIndex: state.currentIndex,
      attempt: state.attempt,
      view: state.view,
      elapsedMs: elapsedMs(),
      savedAt: state.savedAt || Date.now(),
      latestScore: state.latestScore ? { ...state.latestScore } : null,
      evidence: evidenceManager
        ? includeLocalEvidence
          ? evidenceManager.serializeLocal()
          : evidenceManager.serializeCloud()
        : state.evidenceSnapshot,
    };
  }

  function applySnapshot(saved, { localEvidence = false } = {}) {
    if (!saved || ![1, 2].includes(saved.version)) return false;
    const validIds = new Set(state.questions.map((question) => question.id));
    state.answers = Object.fromEntries(
      Object.entries(saved.answers || {}).filter(([id]) => validIds.has(id)),
    );
    state.giveUps = Object.fromEntries(
      Object.entries(saved.giveUps || {}).filter(([id]) => validIds.has(id)),
    );
    state.hintLevels = Object.fromEntries(
      Object.entries(saved.hintLevels || {}).filter(([id]) => validIds.has(id)),
    );
    state.masteredIds = [...new Set(saved.masteredIds || [])].filter((id) => validIds.has(id));
    state.currentIndex = Math.min(
      Math.max(0, Number(saved.currentIndex) || 0),
      Math.max(0, state.questions.length - 1),
    );
    state.attempt = Math.max(1, Number(saved.attempt) || 1);
    state.view = saved.view === "results" ? "results" : "exam";
    state.elapsedBeforeMs = Math.max(0, Number(saved.elapsedMs) || 0);
    state.startedAt = Date.now();
    state.latestScore = saved.latestScore || null;
    state.savedAt = Math.max(0, Number(saved.savedAt) || 0);
    state.evidenceSnapshot = saved.evidence || null;
    if (evidenceManager) {
      evidenceManager.restore(saved.evidence, { merge: !localEvidence });
    }
    return true;
  }

  function loadLocal() {
    try {
      return applySnapshot(JSON.parse(localStorage.getItem(storageKey()) || "null"), {
        localEvidence: true,
      });
    } catch {
      return false;
    }
  }

  function saveLocalNow() {
    try {
      state.savedAt = Date.now();
      localStorage.setItem(
        storageKey(),
        JSON.stringify(snapshot({ includeLocalEvidence: true })),
      );
    } catch {
      // The quiz remains usable when browser storage is unavailable.
    }
  }

  function requestCloud(type, value) {
    if (parent === window || state.identityKey === "guest") return Promise.resolve(null);
    const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const targetOrigin = location.origin === "null" ? "*" : location.origin;
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        pendingStorageRequests.delete(requestId);
        resolve({ ok: false, code: "quiz-progress/timeout" });
      }, 8000);
      pendingStorageRequests.set(requestId, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });
      parent.postMessage({ type, requestId, contentId: state.contentId, value }, targetOrigin);
    });
  }

  async function loadCloud() {
    state.storageStatus = "syncing";
    renderStorageStatus();
    const result = await requestCloud("learning-hub-quiz-load");
    if (result?.ok && result.value) {
      const localSavedAt = state.savedAt;
      if (Number(result.value.savedAt || 0) > localSavedAt || !localSavedAt) {
        applySnapshot(result.value, { localEvidence: false });
      } else if (localSavedAt > Number(result.value.savedAt || 0)) {
        await saveCloudNow();
      }
      state.storageStatus = "cloud";
      render();
      return;
    }
    if (result?.ok && !result.value) {
      await saveCloudNow();
      return;
    }
    state.storageStatus = result?.ok ? "cloud" : "local";
    renderStorageStatus();
  }

  async function saveCloudNow() {
    const result = await requestCloud("learning-hub-quiz-save", snapshot());
    state.storageStatus = result?.ok ? "cloud" : "local";
    renderStorageStatus();
  }

  function persist() {
    clearTimeout(localSaveHandle);
    clearTimeout(cloudSaveHandle);
    localSaveHandle = setTimeout(saveLocalNow, 120);
    if (state.identityKey !== "guest") {
      state.storageStatus = "syncing";
      renderStorageStatus();
      cloudSaveHandle = setTimeout(saveCloudNow, 650);
    }
  }

  function persistLocalOnly() {
    clearTimeout(localSaveHandle);
    localSaveHandle = setTimeout(saveLocalNow, 120);
  }

  function renderStorageStatus() {
    const status = document.querySelector("[data-quiz-storage-status]");
    if (!status) return;
    const copy = {
      cloud: ["บันทึกบน Cloud แล้ว", "Saved to cloud"],
      syncing: ["กำลังบันทึก…", "Saving…"],
      local: ["บันทึกในเครื่องนี้", "Saved on this device"],
    }[state.storageStatus];
    status.dataset.tone = state.storageStatus;
    status.textContent = label(copy[0], copy[1]);
  }

  function activeLanguageNode(source) {
    if (!source) return null;
    return (
      source.querySelector(`[data-quiz-language="${language()}"]`) ||
      source.querySelector("[data-quiz-language]") ||
      source
    );
  }

  function cloneInto(target, source, useLanguage = false) {
    target.replaceChildren();
    const selected = useLanguage ? activeLanguageNode(source) : source;
    if (selected) target.append(selected.cloneNode(true));
  }

  function typeset(target = app) {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetClear?.([target]);
      window.MathJax.typesetPromise([target]).catch(() => {});
    }
  }

  function renderNavigation() {
    const navigation = document.querySelector("[data-question-navigation]");
    if (!navigation) return;
    navigation.replaceChildren();
    state.questions.forEach((question, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(index + 1);
      button.dataset.questionJump = String(index);
      button.dataset.status = questionStatus(question);
      if (index === state.currentIndex) button.dataset.current = "true";
      button.setAttribute("aria-label", label(`ไปข้อ ${index + 1}`, `Go to question ${index + 1}`));
      button.addEventListener("click", () => goTo(index));
      navigation.append(button);
    });
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) return;
    const promptTarget = document.querySelector("[data-current-prompt]");
    const contextTarget = document.querySelector("[data-current-context]");
    const optionTarget = document.querySelector("[data-current-options]");
    const hintTarget = document.querySelector("[data-current-hints]");
    const solutionTarget = document.querySelector("[data-current-solution]");
    const isMastered = state.masteredIds.includes(question.id);
    const isGivenUp = Boolean(state.giveUps[question.id]);

    cloneInto(promptTarget, question.prompt, true);
    cloneInto(contextTarget, question.context);
    contextTarget.hidden = !question.context;
    optionTarget.replaceChildren();

    question.options.forEach((option, index) => {
      const optionId = option.dataset.choiceId;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.dataset.selected = String(state.answers[question.id] === optionId);
      button.disabled = isMastered || isGivenUp;
      button.setAttribute("aria-pressed", String(state.answers[question.id] === optionId));
      button.innerHTML = `<span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span><span class="quiz-option-copy"></span>`;
      const optionCopy = button.querySelector(".quiz-option-copy");
      [...option.childNodes].forEach((node) => optionCopy.append(node.cloneNode(true)));
      button.addEventListener("click", () => selectAnswer(question.id, optionId));
      optionTarget.append(button);
    });

    hintTarget.replaceChildren();
    const visibleHintCount = Math.min(Number(state.hintLevels[question.id]) || 0, question.hints.length);
    question.hints.slice(0, visibleHintCount).forEach((hint, index) => {
      const item = document.createElement("article");
      item.className = "quiz-hint";
      item.innerHTML = `<strong>${label(`คำใบ้ ${index + 1}`, `Hint ${index + 1}`)}</strong>`;
      const copy = document.createElement("div");
      cloneInto(copy, hint, true);
      item.append(copy);
      hintTarget.append(item);
    });

    solutionTarget.replaceChildren();
    if (isGivenUp || isMastered || state.view === "results") {
      solutionTarget.hidden = false;
      const heading = document.createElement("strong");
      heading.textContent = label("เฉลยและวิธีคิด", "Solution and reasoning");
      const copy = document.createElement("div");
      cloneInto(copy, question.solution, true);
      solutionTarget.append(heading, copy);
    } else {
      solutionTarget.hidden = true;
    }

    document.querySelector("[data-question-position]").textContent = `Q${state.currentIndex + 1}/${state.questions.length}`;
    document.querySelector("[data-hint-button]").disabled =
      isMastered || isGivenUp || visibleHintCount >= question.hints.length;
    document.querySelector("[data-hint-count]").textContent = String(visibleHintCount + 1);
    document.querySelector("[data-giveup-button]").disabled = isMastered || isGivenUp;
    document.querySelector("[data-previous-button]").disabled = state.currentIndex === 0;
    document.querySelector("[data-next-button]").disabled = state.currentIndex === state.questions.length - 1;
    document.querySelector("[data-question-lock]").hidden = !isMastered;
    typeset(document.querySelector("[data-question-card]"));
    evidenceManager?.mount(
      document.querySelector("[data-evidence-panel]"),
      question,
    );
  }

  function renderStats() {
    const answered = state.questions.filter(
      (question) => state.answers[question.id] || state.masteredIds.includes(question.id),
    ).length;
    const hints = Object.values(state.hintLevels).reduce((sum, count) => sum + Number(count || 0), 0);
    const giveUps = Object.values(state.giveUps).filter(Boolean).length;
    document.querySelector("[data-answered-count]").textContent = String(answered);
    document.querySelector("[data-hints-count]").textContent = String(hints);
    document.querySelector("[data-giveups-count]").textContent = String(giveUps);
    const progress = document.querySelector("[data-progress-fill]");
    if (progress) progress.style.width = `${(answered / state.questions.length) * 100}%`;
  }

  function resultFor(question) {
    const answer = state.answers[question.id] || "";
    const mastered = state.masteredIds.includes(question.id);
    const correct = mastered || (!state.giveUps[question.id] && answer === question.answer);
    const status = correct
      ? "correct"
      : state.giveUps[question.id]
        ? "giveup"
        : answer
          ? "incorrect"
          : "unanswered";
    return { question, answer, correct, status };
  }

  function renderResults() {
    evidenceManager?.unmount();
    const results = state.questions.map(resultFor);
    const score = results.filter((result) => result.correct).length;
    const percent = Math.round((score / results.length) * 100);
    const perfect = score === results.length;
    app.innerHTML = `
      <section class="quiz-results">
        <header class="quiz-results-hero ${perfect ? "is-perfect" : ""}">
          <small>${perfect ? "MASTERY COMPLETE" : "MASTERY CHECK"}</small>
          <h1>${perfect ? label("ทำครบทุกข้อแล้ว!", "All questions mastered!") : label(`ผลการทำรอบที่ ${state.attempt}`, `Attempt ${state.attempt} results`)}</h1>
          <p>${label(`ได้ ${score} จาก ${results.length} ข้อ (${percent}%)`, `${score} of ${results.length} correct (${percent}%)`)}</p>
        </header>
        <div class="quiz-result-stats">
          <article><strong>${score}/${results.length}</strong><span>${label("คะแนนล่าสุด", "Latest score")}</span></article>
          <article><strong>${formatDuration(elapsedMs())}</strong><span>${label("เวลารวม", "Total time")}</span></article>
          <article><strong>${Object.values(state.hintLevels).reduce((sum, value) => sum + Number(value || 0), 0)}</strong><span>${label("คำใบ้", "Hints")}</span></article>
          <article><strong>${results.filter((result) => !result.correct).length}</strong><span>${label("ต้องทบทวน", "To review")}</span></article>
        </div>
        <section class="quiz-result-list">
          <header>
            <div><small>${label("ตรวจรายข้อ", "Question review")}</small><h2>${label("ย้อนดูและแก้เฉพาะจุด", "Review and fix specific questions")}</h2></div>
            <span data-quiz-storage-status></span>
          </header>
          <div data-result-items></div>
        </section>
        <section class="quiz-evidence-gate" data-evidence-gate data-complete="${String(!evidenceManager?.needsExport())}">
          <div>
            <h2>${evidenceManager?.needsExport() ? label("ส่งออกหลักฐานเพื่อจบรอบ", "Export evidence to finish this attempt") : label("ส่งออกหลักฐานแล้ว", "Evidence export completed")}</h2>
            <p>${evidenceManager?.needsExport() ? label("PDF จะรวมเหตุผล สมุดทด ผลตรวจคำตอบ และตราประทับ AI ส่วนข้อที่ไม่มีวิธีทำจะถูกระบุไว้ในหน้าสรุป", "The PDF includes typed reasoning, notebook work, answer results, and AI stamps. Questions without reasoning are listed on the cover.") : label("หากกลับไปแก้คำตอบ เหตุผล หรือลายมือ ระบบจะขอให้ตรวจและส่งออกใหม่", "Editing an answer, reasoning, or notebook page will require a new check and export.")}</p>
          </div>
          <button type="button" class="quiz-export-evidence-button" data-export-evidence>${evidenceManager?.needsExport() ? label("ดาวน์โหลดหลักฐาน PDF", "Download evidence PDF") : label("ดาวน์โหลด PDF อีกครั้ง", "Download PDF again")}</button>
        </section>
        <footer class="quiz-results-actions">
          <button type="button" class="quiz-secondary-button" data-edit-results>${label("กลับไปแก้คำตอบ", "Edit answers")}</button>
          ${perfect ? `<button type="button" class="quiz-primary-button" data-restart>${label("เริ่มทำใหม่", "Start over")}</button>` : `<button type="button" class="quiz-primary-button" data-retry>${label("ทำเฉพาะข้อที่ยังไม่ผ่าน", "Retry unmastered questions")}</button>`}
        </footer>
      </section>`;

    const list = document.querySelector("[data-result-items]");
    results.forEach((result, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "quiz-result-item";
      item.dataset.status = result.status;
      const statusCopy = {
        correct: label("ถูก", "Correct"),
        incorrect: label("ผิด", "Incorrect"),
        giveup: label("ยอมแพ้", "Gave up"),
        unanswered: label("ยังไม่ตอบ", "Unanswered"),
      }[result.status];
      const aiStamp = evidenceManager?.statusFor(result.question.id, result.status);
      item.innerHTML = `<span class="quiz-result-number">${index + 1}</span><span class="quiz-result-copy"><span data-result-prompt></span><small class="quiz-result-ai-stamp"></small></span><strong>${statusCopy}</strong>`;
      const prompt = activeLanguageNode(result.question.prompt)?.textContent?.replace(/\s+/g, " ").trim();
      item.querySelector("[data-result-prompt]").textContent = prompt || `Q${index + 1}`;
      item.querySelector(".quiz-result-ai-stamp").textContent = aiStamp
        ? language() === "en"
          ? aiStamp.en
          : aiStamp.th
        : "";
      item.addEventListener("click", () => {
        state.currentIndex = index;
        state.view = "exam";
        render();
      });
      list.append(item);
    });

    document.querySelector("[data-edit-results]")?.addEventListener("click", () => {
      state.view = "exam";
      const firstUnmastered = state.questions.findIndex((question) => !state.masteredIds.includes(question.id));
      state.currentIndex = firstUnmastered < 0 ? 0 : firstUnmastered;
      persist();
      render();
    });
    document.querySelector("[data-retry]")?.addEventListener("click", startRetry);
    document.querySelector("[data-restart]")?.addEventListener("click", restart);
    document.querySelector("[data-export-evidence]")?.addEventListener("click", () => {
      void exportEvidence(results);
    });
    renderStorageStatus();
    typeset(app);
  }

  function renderExam() {
    evidenceManager?.unmount();
    const title = contentRoot.querySelector("[data-quiz-title]");
    const titleCopy = title?.dataset[language()] || title?.textContent?.trim() || "Quiz";
    app.innerHTML = `
      <section class="quiz-stage">
        <header class="quiz-identity-card">
          <div class="quiz-title-row">
            <div><small>${label("แบบฝึก Mastery", "Mastery practice")}</small><h1>${escapeHtml(titleCopy)}</h1></div>
            <span class="quiz-question-badge" data-question-position></span>
          </div>
          <div class="quiz-meta-row">
            <span>${state.questions.length} ${label("ข้อ", "questions")}</span>
            <span>${label("ทำทีละข้อ · ตรวจพร้อมกัน", "One at a time · Submit together")}</span>
            <span class="quiz-save-status" data-quiz-storage-status></span>
            <button type="button" class="quiz-print-menu-button" data-open-print>▣ ${label("เครื่องมือพิมพ์", "Print tools")}</button>
          </div>
          <div class="quiz-progress-track"><span data-progress-fill></span></div>
        </header>

        <details class="quiz-navigator" open>
          <summary><span>${label("เลือกหรือย้อนกลับไปยังข้อ", "Jump to any question")}</span><small>${label("สีจะแสดงสถานะของแต่ละข้อ", "Colours show question status")}</small></summary>
          <nav data-question-navigation aria-label="Questions"></nav>
        </details>

        <article class="quiz-question-card" data-question-card>
          <div class="quiz-question-heading">
            <span class="quiz-question-number">${state.currentIndex + 1}</span>
            <div data-current-prompt></div>
          </div>
          <div class="quiz-mastered-note" data-question-lock hidden>✓ ${label("ข้อนี้ผ่านแล้ว คำตอบถูกล็อกไว้", "This question is mastered and locked")}</div>
          <div class="quiz-question-context" data-current-context hidden></div>
          <div class="quiz-options" data-current-options></div>

          <div class="quiz-evidence-panel" data-evidence-panel></div>

          <div class="quiz-hints" data-current-hints></div>
          <section class="quiz-solution" data-current-solution hidden></section>
        </article>

        <footer class="quiz-action-dock">
          <div class="quiz-live-stats">
            <span>${label("ตอบแล้ว", "Answered")} <strong data-answered-count>0</strong>/${state.questions.length}</span>
            <span>${label("ยอมแพ้", "Give up")} <strong data-giveups-count>0</strong></span>
            <span>${label("คำใบ้", "Hints")} <strong data-hints-count>0</strong></span>
            <span class="quiz-stopwatch">● <strong data-elapsed-time>${formatDuration(elapsedMs())}</strong></span>
          </div>
          <div class="quiz-action-grid">
            <button type="button" class="quiz-hint-button" data-hint-button>💡 ${label("คำใบ้", "Hint")} #<span data-hint-count>1</span></button>
            <button type="button" class="quiz-giveup-button" data-giveup-button>⚑ ${label("ยอมแพ้", "Give up")}</button>
            <button type="button" class="quiz-secondary-button" data-previous-button>‹ ${label("ก่อนหน้า", "Previous")}</button>
            <button type="button" class="quiz-next-button" data-next-button>${label("ถัดไป", "Next")} ›</button>
          </div>
          <button type="button" class="quiz-submit-button" data-submit-all>${label("ตรวจคำตอบทั้งหมด", "Submit all answers")}</button>
          <div class="quiz-ai-batch-status" data-ai-batch-status hidden></div>
        </footer>
      </section>`;

    renderNavigation();
    renderQuestion();
    renderStats();
    renderStorageStatus();
    bindExamActions();
  }

  function render() {
    if (!contentRoot) return;
    if (state.view === "results") renderResults();
    else renderExam();
  }

  function selectAnswer(questionId, optionId) {
    if (state.masteredIds.includes(questionId) || state.giveUps[questionId]) return;
    if (state.answers[questionId] !== optionId) {
      evidenceManager?.markContextChanged(questionId);
    }
    state.answers[questionId] = optionId;
    persist();
    renderNavigation();
    renderQuestion();
    renderStats();
  }

  function goTo(index) {
    state.currentIndex = Math.min(Math.max(0, index), state.questions.length - 1);
    persist();
    renderNavigation();
    renderQuestion();
    app.querySelector("[data-question-card]")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function revealHint() {
    const question = currentQuestion();
    if (!question || state.giveUps[question.id]) return;
    const current = Number(state.hintLevels[question.id]) || 0;
    state.hintLevels[question.id] = Math.min(current + 1, question.hints.length);
    persist();
    renderQuestion();
    renderStats();
  }

  function giveUp() {
    const question = currentQuestion();
    if (!question || state.masteredIds.includes(question.id)) return;
    evidenceManager?.markContextChanged(question.id);
    state.giveUps[question.id] = true;
    delete state.answers[question.id];
    persist();
    renderNavigation();
    renderQuestion();
    renderStats();
  }

  function confirmMissingEvidence(questions) {
    if (!questions.length) return Promise.resolve(true);
    const dialog = document.querySelector("[data-evidence-warning-dialog]");
    if (!dialog?.showModal) {
      return Promise.resolve(
        window.confirm(
          label(
            `ข้อ ${questions.map((question) => question.index + 1).join(", ")} ยังไม่มีเหตุผลหรือกระดาษทด ต้องการตรวจต่อหรือไม่`,
            `Questions ${questions.map((question) => question.index + 1).join(", ")} have no reasoning or notebook work. Continue anyway?`,
          ),
        ),
      );
    }

    const title = dialog.querySelector("[data-evidence-warning-title]");
    const copy = dialog.querySelector("[data-evidence-warning-copy]");
    const list = dialog.querySelector("[data-evidence-warning-list]");
    const back = dialog.querySelector("[data-evidence-warning-back]");
    const proceed = dialog.querySelector("[data-evidence-warning-continue]");
    title.textContent = label(
      "บางข้อยังไม่มีเหตุผลหรือกระดาษทด",
      "Some questions have no reasoning evidence",
    );
    copy.textContent = label(
      "AI จะตรวจวิธีคิดไม่ได้ และ PDF จะประทับว่าไม่มีหลักฐานในข้อเหล่านี้ คุณสามารถกลับไปเพิ่มวิธีทำ หรือดำเนินการตรวจคำตอบสุดท้ายต่อได้",
      "AI cannot verify the method, and the PDF will mark these questions as having no reasoning. You can go back and add evidence or continue grading the final answers.",
    );
    list.textContent = questions.map((question) => `Q${question.index + 1}`).join(" · ");
    back.textContent = label("กลับไปเพิ่มวิธีทำ", "Go back and add reasoning");
    proceed.textContent = label(
      "ตรวจต่อโดยไม่มีวิธีทำ",
      "Continue without reasoning",
    );

    return new Promise((resolve) => {
      const finish = (accepted) => {
        dialog.close();
        back.removeEventListener("click", onBack);
        proceed.removeEventListener("click", onProceed);
        dialog.removeEventListener("cancel", onCancel);
        resolve(accepted);
      };
      const onBack = () => finish(false);
      const onProceed = () => finish(true);
      const onCancel = (event) => {
        event.preventDefault();
        finish(false);
      };
      back.addEventListener("click", onBack);
      proceed.addEventListener("click", onProceed);
      dialog.addEventListener("cancel", onCancel);
      dialog.showModal();
    });
  }

  async function submitAll() {
    if (submissionBusy) return;
    const results = state.questions.map(resultFor);
    evidenceManager?.flushCurrent();
    const missing = evidenceManager?.missingForAnswered(results) || [];
    const accepted = await confirmMissingEvidence(missing);
    if (!accepted) {
      if (missing[0]) goTo(missing[0].index);
      return;
    }

    submissionBusy = true;
    const submitButton = document.querySelector("[data-submit-all]");
    const batchStatus = document.querySelector("[data-ai-batch-status]");
    if (submitButton) submitButton.disabled = true;
    if (batchStatus) batchStatus.hidden = false;
    evidenceManager?.noteSubmission(results);

    try {
      const reviewableQuestions = results
        .filter((result) => result.status !== "unanswered")
        .map((result) => result.question);
      await evidenceManager?.reviewPending(reviewableQuestions, ({ current, total, done }) => {
        if (!batchStatus) return;
        batchStatus.textContent = done
          ? label("ตรวจวิธีทำเสร็จแล้ว", "Reasoning review complete")
          : label(
              `AI กำลังตรวจวิธีทำ ${current}/${total}`,
              `AI is checking reasoning ${current}/${total}`,
            );
      });
    } finally {
      submissionBusy = false;
    }

    state.masteredIds = [
      ...new Set([...state.masteredIds, ...results.filter((result) => result.correct).map((result) => result.question.id)]),
    ];
    const score = state.masteredIds.length;
    state.latestScore = {
      score,
      maxScore: state.questions.length,
      status: "awaiting-evidence-export",
      scoreStatus: score === state.questions.length ? "mastered" : "in-progress",
      submittedAt: Date.now(),
    };
    state.elapsedBeforeMs = elapsedMs();
    state.startedAt = Date.now();
    state.view = "results";
    saveLocalNow();
    void saveCloudNow();
    render();
  }

  async function exportEvidence(results = state.questions.map(resultFor)) {
    const button = document.querySelector("[data-export-evidence]");
    if (!evidenceManager || !button) return;
    const title =
      contentRoot.querySelector("[data-quiz-title]")?.dataset[language()] ||
      contentRoot.querySelector("[data-activity-title]")?.dataset[language()] ||
      "Quiz";
    const original = button.textContent;
    button.disabled = true;
    try {
      const files = await evidenceManager.exportPdf({
        title,
        results,
        onProgress: ({ current, total }) => {
          button.textContent = label(
            `กำลังสร้าง PDF ${current}/${total}`,
            `Creating PDF ${current}/${total}`,
          );
        },
      });
      if (state.latestScore) {
        state.latestScore.status =
          state.latestScore.scoreStatus ||
          (state.latestScore.score === state.latestScore.maxScore
            ? "mastered"
            : "in-progress");
        state.latestScore.evidenceExportedAt = Date.now();
        state.latestScore.evidenceFileCount = files.length;
      }
      saveLocalNow();
      await saveCloudNow();
      renderResults();
    } catch (error) {
      window.alert(
        label(
          `สร้าง PDF ไม่สำเร็จ: ${error.message || error}`,
          `PDF export failed: ${error.message || error}`,
        ),
      );
      button.disabled = false;
      button.textContent = original;
    }
  }

  function startRetry() {
    state.questions.forEach((question) => {
      if (state.masteredIds.includes(question.id)) return;
      delete state.answers[question.id];
      delete state.giveUps[question.id];
      delete state.hintLevels[question.id];
    });
    const first = state.questions.findIndex((question) => !state.masteredIds.includes(question.id));
    state.currentIndex = first < 0 ? 0 : first;
    state.attempt += 1;
    state.view = "exam";
    persist();
    render();
  }

  function restart() {
    state.answers = {};
    state.giveUps = {};
    state.hintLevels = {};
    state.masteredIds = [];
    state.currentIndex = 0;
    state.attempt = 1;
    state.view = "exam";
    state.startedAt = Date.now();
    state.elapsedBeforeMs = 0;
    state.latestScore = null;
    persist();
    render();
  }

  function bindExamActions() {
    document.querySelector("[data-hint-button]")?.addEventListener("click", revealHint);
    document.querySelector("[data-giveup-button]")?.addEventListener("click", giveUp);
    document.querySelector("[data-previous-button]")?.addEventListener("click", () => goTo(state.currentIndex - 1));
    document.querySelector("[data-next-button]")?.addEventListener("click", () => goTo(state.currentIndex + 1));
    document.querySelector("[data-submit-all]")?.addEventListener("click", () => {
      void submitAll();
    });
    document.querySelector("[data-open-print]")?.addEventListener("click", () => printToggle?.click());
  }

  function openSummary() {
    if (!contentRoot || !summaryDialog) return;
    const source = contentRoot.querySelector("[data-quiz-summary-content]");
    const heading = contentRoot.querySelector("[data-activity-summary-title]");
    summaryTitle.textContent = heading?.dataset[language()] || heading?.textContent?.trim() || label("สรุป", "Review");
    cloneInto(summaryContent, source);
    if (!summaryDialog.open) summaryDialog.showModal();
    typeset(summaryContent);
  }

  function setLanguage(nextLanguage) {
    document.documentElement.lang = nextLanguage === "en" ? "en" : "th";
    document.querySelectorAll("[data-language-button]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageButton === language()));
    });
    document.querySelectorAll("[data-th][data-en]:not([data-question-prompt]):not([data-question-solution]):not([data-choice-id])").forEach((element) => {
      if (element.children.length === 0 || element.matches("button, span, small, strong, p")) {
        element.textContent = element.dataset[language()];
      }
    });
    render();
  }

  function initializeEvidenceManager() {
    evidenceManager?.unmount();
    evidenceManager = new QuizEvidenceManager({
      contentId: state.contentId,
      identityKey: state.identityKey,
      questions: state.questions,
      language,
      workerUrl: shell.dataset.aiWorkerUrl,
      onChange(detail) {
        state.evidenceSnapshot = evidenceManager.serializeLocal();
        if (detail?.type === "evidence" || (submissionBusy && detail?.type === "review")) {
          persistLocalOnly();
        }
        else persist();
      },
    });
    evidenceManager.configureContextAccessors({
      getAnswer: (questionId) => state.answers[questionId] || "",
      getHintLevel: (questionId) => state.hintLevels[questionId] || 0,
      getGiveUp: (questionId) => Boolean(state.giveUps[questionId]),
    });
    evidenceManager.restore(state.evidenceSnapshot);
  }

  async function loadContent() {
    try {
      const source = resolveContentSource();
      if (!source) throw new Error("No content file was selected.");
      const response = await fetch(new URL(source, location.href));
      if (!response.ok) throw new Error(`Content request failed (${response.status}).`);
      const documentCopy = new DOMParser().parseFromString(await response.text(), "text/html");
      const root = documentCopy.querySelector("[data-learning-activity-content]");
      const validation = validateContent(root);
      if (validation.errors.length) throw new Error(validation.errors.join(" "));

      contentRoot = root;
      state.contentId = root.dataset.activityId;
      state.questions = validation.questions;
      preparePrintSource(contentRoot);
      printSource.replaceChildren(contentRoot);
      loadLocal();
      initializeEvidenceManager();

      window.LearningHubPrint?.configure({
        getTitle: () => contentRoot.querySelector("[data-activity-title]")?.dataset[language()],
        getContent: () => contentRoot,
      });

      loading.hidden = true;
      app.hidden = false;
      render();
      document.dispatchEvent(
        new CustomEvent("learning-hub-quiz-ready", { detail: { contentId: state.contentId, count: state.questions.length } }),
      );
    } catch (error) {
      loading.hidden = true;
      errorBox.hidden = false;
      errorBox.textContent = label(`เปิด Quiz ไม่สำเร็จ: ${error.message}`, `Could not open quiz: ${error.message}`);
    }
  }

  function applyHubContext(context) {
    const nextIdentity = context?.identity?.uid || "guest";
    if (context?.language) setLanguage(context.language);
    if (!contentRoot || nextIdentity === state.identityKey) return;
    saveLocalNow();
    state.identityKey = nextIdentity;
    evidenceManager?.setIdentity(nextIdentity);
    loadLocal();
    if (nextIdentity !== "guest") void loadCloud();
    render();
  }

  window.addEventListener("message", (event) => {
    const trustedOrigin = location.origin === "null" || event.origin === location.origin;
    if (!trustedOrigin) return;
    if (event.source === parent && event.data?.type === "learning-hub-context") {
      applyHubContext(event.data);
      return;
    }
    if (event.data?.type !== "learning-hub-quiz-storage-result") return;
    const resolve = pendingStorageRequests.get(event.data.requestId);
    if (!resolve) return;
    pendingStorageRequests.delete(event.data.requestId);
    resolve(event.data);
  });

  document.addEventListener("learning-hub-context-change", (event) => {
    applyHubContext(event.detail);
  });

  document.querySelectorAll("[data-language-button]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });
  document.querySelector("[data-summary-open]")?.addEventListener("click", openSummary);
  document.querySelector("[data-print-dialog-close]")?.addEventListener("click", () => {
    printPanel.hidden = true;
    printToggle?.setAttribute("aria-expanded", "false");
  });
  printToggle?.addEventListener("click", () => {
    if (!printPanel.hidden) printPanel.querySelector("button")?.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !printPanel.hidden) {
      printPanel.hidden = true;
      printToggle?.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && contentRoot) saveLocalNow();
  });
  window.addEventListener("beforeunload", (event) => {
    evidenceManager?.flushCurrent();
    saveLocalNow();
    if (state.latestScore && evidenceManager?.needsExport()) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  timerHandle = setInterval(() => {
    const timer = document.querySelector("[data-elapsed-time]");
    if (timer) timer.textContent = formatDuration(elapsedMs());
  }, 1000);

  window.LearningHubQuiz = Object.freeze({
    getState: () => ({ ...snapshot(), contentId: state.contentId }),
    goToQuestion: goTo,
    openSummary,
    restart,
    save: () => {
      saveLocalNow();
      return saveCloudNow();
    },
  });

  void loadContent();
})();
