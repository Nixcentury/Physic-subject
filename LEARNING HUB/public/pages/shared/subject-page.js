/* ==============================================================
   โครงหน้ารายวิชากลางของ Learning Hub
   - ชื่อวิชาและรายการบทอยู่ใน HTML ของแต่ละวิชา
   - ไฟล์นี้ดูแล Navigation 3 ชั้นและการเปิดหน้าต่างงาน
   - ยังไม่มี Quiz, คะแนน, Simulation หรือ Notebook จริง
================================================================ */

const subjectRoot = document.querySelector("[data-subject-page]");
const chapterTemplate = document.querySelector("#subject-chapters");

function setLocalizedText(element, thai, english) {
  element.dataset.th = thai;
  element.dataset.en = english;
  element.textContent = document.documentElement.lang === "en" ? english : thai;
}

function readLocalizedText(element, fallbackThai, fallbackEnglish) {
  return {
    th: element?.dataset.th?.trim() || element?.textContent?.trim() || fallbackThai,
    en: element?.dataset.en?.trim() || fallbackEnglish,
  };
}

function buildSubjectPage() {
  if (!subjectRoot || !(chapterTemplate instanceof HTMLTemplateElement)) return;

  const subject = {
    id: subjectRoot.dataset.subjectId || "subject",
    icon: subjectRoot.dataset.subjectIcon || "◇",
    titleTh: subjectRoot.dataset.subjectTitleTh || "รายวิชา",
    titleEn: subjectRoot.dataset.subjectTitleEn || "Subject",
  };

  subjectRoot.innerHTML = `
    <header class="page-heading subject-heading">
      <span class="page-icon" id="subject-icon" aria-hidden="true"></span>
      <div>
        <small data-th="รายวิชา" data-en="Subject">รายวิชา</small>
        <h1 id="subject-title"></h1>
      </div>
      <span
        class="prototype-badge"
        data-th="โครงระบบ · ยังไม่มีเนื้อหาจริง"
        data-en="System prototype · No live content yet"
      >โครงระบบ · ยังไม่มีเนื้อหาจริง</span>
    </header>

    <nav
      class="stage-path"
      data-aria-th="ลำดับการเปิดเนื้อหา"
      data-aria-en="Content opening steps"
      aria-label="ลำดับการเปิดเนื้อหา"
    >
      <div class="stage is-active" data-stage="1">
        <strong>1</strong>
        <span data-th="เลือกบทและเรื่อง" data-en="Choose chapter">เลือกบทและเรื่อง</span>
      </div>
      <div class="stage" data-stage="2">
        <strong>2</strong>
        <span data-th="เลือกงานหรือเครื่องมือ" data-en="Choose activity">เลือกงานหรือเครื่องมือ</span>
      </div>
      <div class="stage" data-stage="3">
        <strong>3</strong>
        <span data-th="เปิดหน้าต่างงาน" data-en="Open tool window">เปิดหน้าต่างงาน</span>
      </div>
    </nav>

    <section id="chapter-view" aria-labelledby="chapter-view-title">
      <div class="section-intro">
        <div>
          <small class="eyebrow" data-th="ชั้นที่ 1" data-en="Layer 1">ชั้นที่ 1</small>
          <h2 id="chapter-view-title" data-th="เลือกบทที่ต้องการ" data-en="Choose a chapter">
            เลือกบทที่ต้องการ
          </h2>
        </div>
        <p
          data-th="การ์ดทั้ง 4 ใบเป็นช่องว่างสำหรับเนื้อหาใหม่ กดเพื่อทดลองชั้นเลือกงาน"
          data-en="These four cards are reserved for new content. Select one to test the activity layer."
        >การ์ดทั้ง 4 ใบเป็นช่องว่างสำหรับเนื้อหาใหม่ กดเพื่อทดลองชั้นเลือกงาน</p>
      </div>
      <div class="chapter-grid" id="chapter-grid"></div>
    </section>

    <section class="activity-view" id="activity-view" aria-labelledby="activity-view-title" hidden>
      <header class="activity-heading surface">
        <button class="back-button" id="back-to-chapters" type="button">
          <span aria-hidden="true">←</span>
          <span data-th="กลับไปเลือกบท" data-en="Back to chapters">กลับไปเลือกบท</span>
        </button>
        <div>
          <small class="eyebrow" data-th="ชั้นที่ 2 · รายการงาน" data-en="Layer 2 · Activities">
            ชั้นที่ 2 · รายการงาน
          </small>
          <h2 id="activity-view-title" tabindex="-1"></h2>
          <p
            data-th="ทดลองเปิดหลายงานพร้อมกัน แล้วใช้ปุ่มสีด้านบนหรือแถบงานด้านล่าง"
            data-en="Open several tools, then use the colored controls or the bottom taskbar."
          >ทดลองเปิดหลายงานพร้อมกัน แล้วใช้ปุ่มสีด้านบนหรือแถบงานด้านล่าง</p>
        </div>
      </header>

      <div class="activity-grid">
        <button class="activity-card accent-blue" type="button" data-tool-kind="activity">
          <span class="activity-icon" aria-hidden="true">✎</span>
          <span class="activity-copy">
            <small data-th="พื้นที่งาน" data-en="Activity">พื้นที่งาน</small>
            <strong data-th="งานตัวอย่างเปล่า" data-en="Blank activity sample">งานตัวอย่างเปล่า</strong>
            <span
              data-th="ทดสอบหน้าต่างสำหรับโจทย์ คำสั่ง และการส่งงาน"
              data-en="Tests a window for prompts, instructions, and submission."
            >ทดสอบหน้าต่างสำหรับโจทย์ คำสั่ง และการส่งงาน</span>
          </span>
          <b aria-hidden="true">↗</b>
        </button>

        <button class="activity-card accent-mint" type="button" data-tool-kind="simulation">
          <span class="activity-icon" aria-hidden="true">◉</span>
          <span class="activity-copy">
            <small data-th="ห้องทดลอง" data-en="Simulation">ห้องทดลอง</small>
            <strong data-th="Simulation ตัวอย่างเปล่า" data-en="Blank simulation sample">
              Simulation ตัวอย่างเปล่า
            </strong>
            <span
              data-th="ทดสอบพื้นที่กว้างสำหรับเครื่องมือจำลองในอนาคต"
              data-en="Tests a wide canvas for future simulations."
            >ทดสอบพื้นที่กว้างสำหรับเครื่องมือจำลองในอนาคต</span>
          </span>
          <b aria-hidden="true">↗</b>
        </button>

        <button class="activity-card accent-violet" type="button" data-tool-kind="notebook">
          <span class="activity-icon" aria-hidden="true">▱</span>
          <span class="activity-copy">
            <small data-th="สมุดบันทึก" data-en="Notebook">สมุดบันทึก</small>
            <strong data-th="Notebook ตัวอย่างเปล่า" data-en="Blank notebook sample">
              Notebook ตัวอย่างเปล่า
            </strong>
            <span
              data-th="สำรองที่ไว้สำหรับสมุดกลางและกลไก Save/Load ภายหลัง"
              data-en="Reserves space for the shared notebook and later Save/Load."
            >สำรองที่ไว้สำหรับสมุดกลางและกลไก Save/Load ภายหลัง</span>
          </span>
          <b aria-hidden="true">↗</b>
        </button>
      </div>

      <p class="prototype-note">
        <span aria-hidden="true">◇</span>
        <span
          data-th="รอบนี้ทดสอบเฉพาะโครง Navigation และหน้าต่าง ยังไม่มีคำถาม คะแนน หรือการบันทึกข้อมูล"
          data-en="This round tests navigation and windows only. There are no questions, scores, or saved data."
        >รอบนี้ทดสอบเฉพาะโครง Navigation และหน้าต่าง ยังไม่มีคำถาม คะแนน หรือการบันทึกข้อมูล</span>
      </p>
    </section>
  `;

  const subjectIcon = subjectRoot.querySelector("#subject-icon");
  const subjectTitle = subjectRoot.querySelector("#subject-title");
  const chapterGrid = subjectRoot.querySelector("#chapter-grid");
  const chapterView = subjectRoot.querySelector("#chapter-view");
  const activityView = subjectRoot.querySelector("#activity-view");
  const activityTitle = subjectRoot.querySelector("#activity-view-title");
  const backButton = subjectRoot.querySelector("#back-to-chapters");
  const stageItems = [...subjectRoot.querySelectorAll("[data-stage]")];
  const chapterDefinitions = [...chapterTemplate.content.querySelectorAll("[data-chapter]")];
  let selectedChapter = chapterDefinitions[0]?.dataset.chapter || "1";

  subjectIcon.textContent = subject.icon;
  setLocalizedText(subjectTitle, subject.titleTh, subject.titleEn);
  chapterGrid.dataset.ariaTh = `โครงบท${subject.titleTh}`;
  chapterGrid.dataset.ariaEn = `${subject.titleEn} chapter placeholders`;
  chapterGrid.setAttribute("aria-label", chapterGrid.dataset.ariaTh);

  chapterDefinitions.forEach((definition, index) => {
    const chapterId = definition.dataset.chapter || String(index + 1);
    const title = readLocalizedText(
      definition.querySelector("[data-chapter-title]"),
      "รอตั้งชื่อบท",
      "Chapter title pending",
    );
    const description = readLocalizedText(
      definition.querySelector("[data-chapter-description]"),
      "พื้นที่สำหรับเรื่องและหัวข้อย่อย",
      "Space for topics and subtopics",
    );
    const button = document.createElement("button");
    const chapterNumber = String(chapterId).padStart(2, "0");

    button.className = "chapter-card";
    button.type = "button";
    button.dataset.chapter = chapterId;
    button.innerHTML = `
      <span class="chapter-number"></span>
      <small class="chapter-label"></small>
      <h3 class="chapter-title"></h3>
      <p class="chapter-description"></p>
      <span class="chapter-action">
        <span data-th="ดูงานตัวอย่าง" data-en="View sample tools">ดูงานตัวอย่าง</span>
        <b aria-hidden="true">→</b>
      </span>
    `;

    button.querySelector(".chapter-number").textContent = chapterNumber;
    setLocalizedText(
      button.querySelector(".chapter-label"),
      `บทที่ ${chapterId}`,
      `Chapter ${chapterId}`,
    );
    setLocalizedText(button.querySelector(".chapter-title"), title.th, title.en);
    setLocalizedText(
      button.querySelector(".chapter-description"),
      description.th,
      description.en,
    );
    chapterGrid.append(button);
  });

  function setStage(activeStage) {
    stageItems.forEach((stage) => {
      const stageNumber = Number(stage.dataset.stage);
      stage.classList.toggle("is-active", stageNumber === activeStage);
      stage.classList.toggle("is-complete", stageNumber < activeStage);
    });
  }

  function updateActivityTitle() {
    setLocalizedText(
      activityTitle,
      `${subject.titleTh} · งานตัวอย่าง · บทที่ ${selectedChapter}`,
      `${subject.titleEn} · Sample tools · Chapter ${selectedChapter}`,
    );
  }

  function showActivities(chapter) {
    selectedChapter = String(chapter);
    updateActivityTitle();
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
    subjectRoot.querySelector(`[data-chapter="${selectedChapter}"]`)?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  chapterGrid.querySelectorAll("[data-chapter]").forEach((button) => {
    button.addEventListener("click", () => showActivities(button.dataset.chapter));
  });

  subjectRoot.querySelectorAll("[data-tool-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      const toolId = `${subject.id}-c${selectedChapter}-${button.dataset.toolKind}`;
      const targetOrigin = location.origin === "null" ? "*" : location.origin;
      parent.postMessage({ type: "learning-hub-open-tool", toolId }, targetOrigin);
      setStage(3);
    });
  });

  backButton.addEventListener("click", showChapters);
  updateActivityTitle();
}

buildSubjectPage();
