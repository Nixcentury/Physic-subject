/* ==============================================================
   JavaScript ของ Learning Hub
   ไฟล์นี้ดูแลเพียง 3 อย่าง: เปลี่ยนภาษา, เข้า/ออก Hub, เปลี่ยนแท็บ
   ข้อความและโครงหน้าแก้ได้จาก index.html โดยตรง
================================================================ */

const languageStorageKey = "learning-hub-language";

const loginView = document.querySelector("#login-view");
const hubView = document.querySelector("#hub-view");
const googleButton = document.querySelector("#google-button");
const guestButton = document.querySelector("#guest-button");
const signOutButton = document.querySelector("#sign-out-button");
const authNotice = document.querySelector("#auth-notice");
const languageButtons = document.querySelectorAll("[data-language]");
const navButtons = document.querySelectorAll("[data-section]");
const subjectPanels = document.querySelectorAll(".subject-panel");

let currentLanguage = readSavedLanguage();

function readSavedLanguage() {
  try {
    return localStorage.getItem(languageStorageKey) === "en" ? "en" : "th";
  } catch {
    return "th";
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    // หากเบราว์เซอร์ปิดการบันทึก ภาษาในหน้าปัจจุบันยังใช้งานได้ตามปกติ
  }
}

/* สร้างหน้าว่างของแต่ละวิชาจากชื่อที่เขียนไว้ใน index.html */
function prepareSubjectPanels() {
  subjectPanels.forEach((panel) => {
    const nameTh = panel.dataset.nameTh;
    const nameEn = panel.dataset.nameEn;
    const icon = panel.dataset.icon;
    const theme = panel.dataset.theme;

    panel.innerHTML = `
      <header class="page-heading">
        <span class="page-icon subject-${theme}" aria-hidden="true">${icon}</span>
        <div>
          <p data-th="รายวิชา" data-en="Subject">รายวิชา</p>
          <h1 tabindex="-1" data-th="${nameTh}" data-en="${nameEn}">${nameTh}</h1>
        </div>
      </header>
      <article class="empty-card content-surface">
        <span class="empty-icon subject-${theme}" aria-hidden="true">${icon}</span>
        <small data-th="เนื้อหาใหม่เท่านั้น" data-en="New content only">เนื้อหาใหม่เท่านั้น</small>
        <h2
          data-th="กำลังเตรียมเนื้อหาใหม่สำหรับ${nameTh}"
          data-en="New ${nameEn} content is on the way"
        >กำลังเตรียมเนื้อหาใหม่สำหรับ${nameTh}</h2>
        <p
          data-th="แท็บวิชาพร้อมแล้ว แต่ยังไม่ใส่บทเรียน แบบทดสอบ หรือห้องทดลองจำลอง เพื่อให้เริ่มออกแบบเนื้อหาใหม่ทั้งหมด"
          data-en="The subject tab is ready, with no lessons, quizzes, or simulations added yet, so every piece of content can be designed from scratch."
        >แท็บวิชาพร้อมแล้ว แต่ยังไม่ใส่บทเรียน แบบทดสอบ หรือห้องทดลองจำลอง เพื่อให้เริ่มออกแบบเนื้อหาใหม่ทั้งหมด</p>
        <span class="coming-soon" data-th="พร้อมพัฒนาต่อในรอบถัดไป" data-en="Ready for the next phase">พร้อมพัฒนาต่อในรอบถัดไป</span>
      </article>
    `;
  });
}

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;

  document.querySelectorAll("[data-th][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll("[data-aria-th][data-aria-en]").forEach((element) => {
    const label = language === "th" ? element.dataset.ariaTh : element.dataset.ariaEn;
    element.setAttribute("aria-label", label);
    element.setAttribute("title", label);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const description =
    language === "th"
      ? "พื้นที่รวมบทเรียน ห้องเรียน แบบทดสอบ และห้องทดลองจำลองในที่เดียว"
      : "One place for lessons, classrooms, quizzes, and simulations.";

  document.querySelector('meta[name="description"]').setAttribute("content", description);
  saveLanguage(language);
}

function showHub() {
  loginView.hidden = true;
  hubView.hidden = false;
  hubView.querySelector(".content-panel:not([hidden]) h1")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLogin() {
  hubView.hidden = true;
  loginView.hidden = false;
  authNotice.hidden = true;
  document.querySelector("#login-heading")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSection(sectionId) {
  document.querySelectorAll(".content-panel").forEach((panel) => {
    panel.hidden = panel.id !== sectionId;
  });

  navButtons.forEach((button) => {
    const isActive = button.dataset.section === sectionId;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  document.querySelector(`#${sectionId} h1`)?.focus();
}

prepareSubjectPanels();
setLanguage(currentLanguage);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

googleButton.addEventListener("click", () => {
  authNotice.hidden = false;
});

guestButton.addEventListener("click", showHub);
signOutButton.addEventListener("click", showLogin);

navButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

document.querySelectorAll(".brand").forEach((brandLink) => {
  brandLink.addEventListener("click", (event) => event.preventDefault());
});
