/* ==============================================================
   เครื่องมือกลางสำหรับหน้า Quiz / Simulation / Notebook
   เรียกใช้ไฟล์นี้ไฟล์เดียวเพื่อ:
   - ปิดเมนูแตะค้าง เลือกข้อความ คัดลอก และลากองค์ประกอบ
   - เพิ่มปุ่มกลับ Hub เมื่อใส่ attribute data-hub-back
================================================================ */

(function initializeLearningHubTools() {
  if (window.LearningHubTools) return;

  const sourceScripts = [
    ...document.querySelectorAll('script[src*="learning-hub-tools.js"]'),
  ];
  const sourceScript =
    document.currentScript || sourceScripts[sourceScripts.length - 1];
  const editableSelector =
    'input, textarea, select, [contenteditable="true"], [data-allow-selection]';
  const blockedEvents = [
    "contextmenu",
    "selectstart",
    "dragstart",
    "copy",
    "beforecopy",
  ];

  function isEditableTarget(target) {
    return target instanceof Element && Boolean(target.closest(editableSelector));
  }

  function blockNativeSelection(event) {
    if (!isEditableTarget(event.target)) event.preventDefault();
  }

  function installInteractionGuard() {
    if (document.documentElement.dataset.hubInteractionGuard === "ready") return;

    document.documentElement.dataset.hubInteractionGuard = "ready";
    const style = document.createElement("style");
    style.dataset.hubInteractionGuardStyle = "";
    style.textContent = `
      html,
      body,
      body * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        user-select: none;
      }

      input,
      textarea,
      select,
      [contenteditable="true"],
      [contenteditable="true"] *,
      [data-allow-selection],
      [data-allow-selection] * {
        -webkit-touch-callout: default;
        -webkit-user-select: text;
        user-select: text;
      }

      .learning-hub-back-button {
        position: fixed;
        z-index: 2147483000;
        top: max(12px, env(safe-area-inset-top));
        left: max(12px, env(safe-area-inset-left));
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        gap: 7px;
        padding: 8px 13px;
        border: 1px solid rgba(119, 151, 205, 0.34);
        border-radius: 999px;
        background: rgba(249, 252, 255, 0.94);
        box-shadow: 0 10px 28px rgba(31, 65, 119, 0.16);
        color: #1c3768;
        font: 700 13px/1.2 "Noto Sans Thai", "Leelawadee UI", Tahoma, Arial, sans-serif;
        cursor: pointer;
        touch-action: manipulation;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }

      .learning-hub-back-button:hover {
        background: #ffffff;
      }

      .learning-hub-back-button:focus-visible {
        outline: 3px solid rgba(80, 122, 202, 0.36);
        outline-offset: 2px;
      }
    `;
    document.head.append(style);

    blockedEvents.forEach((eventName) => {
      document.addEventListener(eventName, blockNativeSelection, true);
    });
  }

  function defaultHubUrl() {
    if (sourceScript?.src) {
      const localSource = sourceScript.src.startsWith("file:");
      return new URL(localSource ? "../../index.html" : "../", sourceScript.src).href;
    }

    const repositoryRoot = "/Physic-subject/";
    const rootIndex = location.pathname.indexOf(repositoryRoot);
    if (rootIndex >= 0) {
      return `${location.origin}${location.pathname.slice(
        0,
        rootIndex + repositoryRoot.length,
      )}`;
    }
    return new URL("../../", location.href).href;
  }

  function currentLanguage() {
    return document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "th";
  }

  function updateBackButton(language = currentLanguage()) {
    const button = document.querySelector("[data-hub-back-button]");
    if (!button) return;

    const label = language === "en" ? "Back" : "ย้อนกลับ";
    button.querySelector("[data-hub-back-label]").textContent = label;
    button.setAttribute("aria-label", language === "en" ? "Back to Learning Hub" : "กลับ Learning Hub");
    button.title = language === "en" ? "Back to Learning Hub" : "กลับ Learning Hub";
  }

  function requestBack(hubUrl) {
    if (window.parent !== window) {
      const targetOrigin = location.origin === "null" ? "*" : location.origin;
      window.parent.postMessage({ type: "learning-hub-close-tool" }, targetOrigin);
      return;
    }

    const hasSameSiteReferrer = (() => {
      if (!document.referrer) return false;
      try {
        return new URL(document.referrer).origin === location.origin;
      } catch {
        return false;
      }
    })();

    if (history.length > 1 && hasSameSiteReferrer) {
      history.back();
      return;
    }
    location.assign(hubUrl);
  }

  function addBackButton(options = {}) {
    const existingButton = document.querySelector("[data-hub-back-button]");
    if (existingButton) return existingButton;

    const hubUrl = options.hubUrl || sourceScript?.dataset.hubUrl || defaultHubUrl();
    const button = document.createElement("button");
    button.className = "learning-hub-back-button";
    button.type = "button";
    button.dataset.hubBackButton = "";
    button.innerHTML = '<span aria-hidden="true">←</span><span data-hub-back-label></span>';
    button.addEventListener("click", () => requestBack(hubUrl));
    document.body.prepend(button);
    document.body.classList.add("has-hub-back-button");
    updateBackButton(options.language);
    return button;
  }

  installInteractionGuard();
  window.LearningHubTools = Object.freeze({
    addBackButton,
    installInteractionGuard,
    updateBackButton,
  });

  if (sourceScript?.hasAttribute("data-hub-back")) {
    addBackButton({
      hubUrl: sourceScript.dataset.hubUrl,
      language: sourceScript.dataset.hubLanguage,
    });
  }
})();
