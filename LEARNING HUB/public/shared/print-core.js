/* ==============================================================
   Print Core กลางของ Learning Hub
   - เครื่องมือทุกชนิดเรียกปุ่มปริ้นจากไฟล์เดียวกัน
   - เตรียมชื่อเอกสาร วันที่ และสถานะก่อนเปิด Print Preview
   - รูปแบบกระดาษทั้งหมดอยู่ใน print-core.css
================================================================ */

(function initializeLearningHubPrint() {
  if (window.LearningHubPrint) return;

  let originalTitle = document.title;
  let configuredTitle = null;

  function language() {
    return document.documentElement.lang === "en" ? "en" : "th";
  }

  function resolveTitle() {
    if (typeof configuredTitle === "function") {
      return String(configuredTitle() || "").trim();
    }
    return String(configuredTitle || "").trim();
  }

  function formatPrintDate(now = new Date()) {
    return new Intl.DateTimeFormat(language() === "en" ? "en-GB" : "th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(now);
  }

  function prepare() {
    const title = resolveTitle();
    if (title) document.title = `${title} · Learning Hub`;

    document.querySelectorAll("[data-print-generated-at]").forEach((element) => {
      element.textContent = formatPrintDate();
    });
    document.body.dataset.printReady = "true";
  }

  function restore() {
    document.title = originalTitle;
    delete document.body.dataset.printReady;
  }

  function configure({ getTitle } = {}) {
    if (getTitle) configuredTitle = getTitle;
    originalTitle = document.title;
  }

  function print() {
    prepare();
    window.print();
  }

  window.addEventListener("beforeprint", prepare);
  window.addEventListener("afterprint", restore);

  window.LearningHubPrint = Object.freeze({
    configure,
    prepare,
    print,
  });
})();
