/* หน้า Physics รอบ 4B: เลือกบท แล้วส่งคำขอเปิดงานไปยัง Hub กลาง */

const chapterView = document.querySelector("#chapter-view");
const activityView = document.querySelector("#activity-view");
const activityTitle = document.querySelector("#activity-view-title");
const backButton = document.querySelector("#back-to-chapters");
const stageItems = [...document.querySelectorAll("[data-stage]")];
let selectedChapter = "1";

function setStage(activeStage) {
  stageItems.forEach((stage) => {
    const stageNumber = Number(stage.dataset.stage);
    stage.classList.toggle("is-active", stageNumber === activeStage);
    stage.classList.toggle("is-complete", stageNumber < activeStage);
  });
}

function showActivities(chapter) {
  selectedChapter = String(chapter);
  activityTitle.dataset.th = `งานตัวอย่าง · บทที่ ${selectedChapter}`;
  activityTitle.dataset.en = `Sample tools · Chapter ${selectedChapter}`;
  activityTitle.textContent =
    document.documentElement.lang === "en"
      ? activityTitle.dataset.en
      : activityTitle.dataset.th;
  chapterView.hidden = true;
  activityView.hidden = false;
  setStage(2);
  activityTitle.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showChapters() {
  activityView.hidden = true;
  chapterView.hidden = false;
  setStage(1);
  document.querySelector(`[data-chapter="${selectedChapter}"]`)?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-chapter]").forEach((button) => {
  button.addEventListener("click", () => showActivities(button.dataset.chapter));
});

document.querySelectorAll("[data-tool-kind]").forEach((button) => {
  button.addEventListener("click", () => {
    const toolId = `physics-c${selectedChapter}-${button.dataset.toolKind}`;
    const targetOrigin = location.origin === "null" ? "*" : location.origin;
    parent.postMessage({ type: "learning-hub-open-tool", toolId }, targetOrigin);
    setStage(3);
  });
});

backButton.addEventListener("click", showChapters);
