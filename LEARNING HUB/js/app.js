/* ==============================================================
   JavaScript ของ Learning Hub
   ดูแลภาษา หน้าหลัก แท็บ และนำสถานะจากระบบบัญชีกลางมาแสดง
   Firebase และขั้นตอน Login อยู่ใน auth.js เพื่อให้หน้าอื่นใช้ร่วมกันได้
================================================================ */

import {
  continueAsGuest,
  signInWithGoogle,
  signOutFromHub,
  subscribeAuth,
} from "./auth.js";
import {
  setPresenceContext,
  stopPresence,
  subscribePresence,
} from "./presence.js";

const languageStorageKey = "learning-hub-language";

const loginView = document.querySelector("#login-view");
const hubView = document.querySelector("#hub-view");
const googleButton = document.querySelector("#google-button");
const guestButton = document.querySelector("#guest-button");
const signOutButton = document.querySelector("#sign-out-button");
const authNotice = document.querySelector("#auth-notice");
const authNoticeIcon = document.querySelector("#auth-notice-icon");
const authNoticeText = document.querySelector("#auth-notice-text");
const accountChip = document.querySelector("#account-chip");
const accountAvatar = document.querySelector("#account-avatar");
const accountName = document.querySelector("#account-name");
const accountDetail = document.querySelector("#account-detail");
const presenceButton = document.querySelector("#presence-button");
const presenceDot = document.querySelector("#presence-dot");
const presenceCount = document.querySelector("#presence-count");
const presenceBackdrop = document.querySelector("#presence-backdrop");
const presencePanel = document.querySelector("#presence-panel");
const presenceClose = document.querySelector("#presence-close");
const presenceOnlineTotal = document.querySelector("#presence-online-total");
const presenceIdleTotal = document.querySelector("#presence-idle-total");
const presenceVisibleTotal = document.querySelector("#presence-visible-total");
const presenceMessage = document.querySelector("#presence-message");
const presenceList = document.querySelector("#presence-list");
const languageButtons = document.querySelectorAll("[data-language]");
const navButtons = document.querySelectorAll("[data-section]");
const subjectPanels = document.querySelectorAll(".subject-panel");

const fallbackAvatar = accountAvatar.src;
let currentLanguage = readSavedLanguage();
let activeSession = { status: "loading", isGuest: false, user: null };
let activePresence = {
  connectionStatus: "OFFLINE",
  rows: [],
  counts: { online: 0, idle: 0, visible: 0, active: 0 },
  error: "",
};
let presenceReturnFocus = null;

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

function renderAccount(session) {
  accountChip.classList.remove("has-error");
  accountChip.removeAttribute("title");

  if (session.status === "signed-in" && session.user) {
    accountName.textContent =
      session.user.displayName || session.user.email || "Learning Hub user";
    accountDetail.textContent =
      session.user.email ||
      (currentLanguage === "th" ? "เชื่อมบัญชี Google แล้ว" : "Google account connected");
    accountAvatar.src = session.user.photoURL || fallbackAvatar;
    return;
  }

  accountName.textContent = currentLanguage === "th" ? "ผู้เยี่ยมชม" : "Guest";
  accountDetail.textContent =
    currentLanguage === "th" ? "ไม่บันทึกบน Cloud" : "Not saved to the cloud";
  accountAvatar.src = fallbackAvatar;
}

function closePresencePanel() {
  presencePanel.hidden = true;
  presencePanel.setAttribute("aria-hidden", "true");
  presenceBackdrop.hidden = true;
  presenceButton.setAttribute("aria-expanded", "false");
  presenceReturnFocus?.focus();
  presenceReturnFocus = null;
}

function openPresencePanel() {
  if (presenceButton.hidden) return;
  presenceReturnFocus = document.activeElement;
  presencePanel.hidden = false;
  presencePanel.setAttribute("aria-hidden", "false");
  presenceBackdrop.hidden = false;
  presenceButton.setAttribute("aria-expanded", "true");
  presenceClose.focus();
}

function renderPresence(presence) {
  activePresence = presence;
  const isSignedIn = activeSession.status === "signed-in";
  presenceButton.hidden = !isSignedIn;

  if (!isSignedIn) {
    closePresencePanel();
  }

  const statusClass = presence.connectionStatus.toLowerCase();
  presenceDot.className = `presence-dot ${statusClass}`;
  presenceCount.textContent = String(presence.counts.active);
  presenceOnlineTotal.textContent = String(presence.counts.online);
  presenceIdleTotal.textContent = String(presence.counts.idle);
  presenceVisibleTotal.textContent = String(presence.counts.visible);

  presenceMessage.classList.toggle("is-error", Boolean(presence.error));

  if (presence.error) {
    presenceMessage.textContent =
      currentLanguage === "th"
        ? "ยังอ่านรายชื่อออนไลน์ไม่ได้ กรุณาตรวจสิทธิ์ Firebase ของ quizPresence"
        : "Online people are unavailable. Check Firebase permissions for quizPresence.";
  } else if (presence.connectionStatus === "OFFLINE") {
    presenceMessage.textContent =
      currentLanguage === "th"
        ? "กำลังเชื่อมต่อระบบคนออนไลน์"
        : "Connecting to live presence";
  } else {
    presenceMessage.textContent =
      currentLanguage === "th"
        ? `เชื่อมต่อแล้ว · กำลังใช้งาน ${presence.counts.active} คน`
        : `Connected · ${presence.counts.active} active`;
  }

  presenceList.replaceChildren();

  if (!presence.rows.length) {
    const empty = document.createElement("p");
    empty.className = "presence-empty";
    empty.textContent = presence.error
      ? currentLanguage === "th"
        ? "ระบบ Login ยังใช้ได้ตามปกติ แต่ต้องปรับ Database Rules ก่อนแสดงรายชื่อ"
        : "Login still works, but Database Rules must be updated before showing people."
      : currentLanguage === "th"
        ? "ยังไม่มีผู้ใช้ที่แสดงใน Learning Hub"
        : "No visible users in the Learning Hub yet.";
    presenceList.append(empty);
    return;
  }

  const lockedList = document.createElement("p");
  lockedList.className = "presence-empty";
  lockedList.textContent =
    currentLanguage === "th"
      ? "🔒 รายชื่อบุคคลจะเปิดเฉพาะบัญชีครูและแอดมินที่ได้รับอนุมัติ หลังเชื่อมระบบบทบาท"
      : "🔒 Names will be available only to approved teacher and admin accounts after roles are connected.";
  presenceList.append(lockedList);
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
  renderAccount(activeSession);
  renderPresence(activePresence);
  saveLanguage(language);
}

function showHub() {
  loginView.hidden = true;
  hubView.hidden = false;
  hubView.querySelector(".content-panel:not([hidden]) h1")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLogin(preserveNotice = false) {
  hubView.hidden = true;
  loginView.hidden = false;
  if (!preserveNotice) authNotice.hidden = true;
  document.querySelector("#login-heading")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setAuthBusy(isBusy) {
  googleButton.disabled = isBusy;
  guestButton.disabled = isBusy;
  googleButton.setAttribute("aria-busy", String(isBusy));
  guestButton.setAttribute("aria-busy", String(isBusy));
}

function setAuthNotice(messageTh, messageEn, tone = "info") {
  authNoticeText.dataset.th = messageTh;
  authNoticeText.dataset.en = messageEn;
  authNoticeText.textContent = currentLanguage === "th" ? messageTh : messageEn;
  authNotice.classList.toggle("is-error", tone === "error");
  authNotice.classList.toggle("is-success", tone === "success");
  authNotice.setAttribute("role", tone === "error" ? "alert" : "status");
  authNotice.setAttribute("aria-live", tone === "error" ? "assertive" : "polite");
  authNoticeIcon.textContent = tone === "error" ? "!" : tone === "success" ? "✓" : "●";
  authNotice.hidden = false;
}

function authErrorMessage(error) {
  const code = error?.code || "unknown";

  const messages = {
    "hub/file-protocol": [
      "Google Login ต้องเปิดผ่าน localhost หรือ GitHub Pages",
      "Open the Hub through localhost or GitHub Pages to use Google Login.",
    ],
    "auth/popup-blocked": [
      "เบราว์เซอร์ปิดกั้นหน้าต่าง Google กรุณาอนุญาต Pop-up แล้วลองอีกครั้ง",
      "Your browser blocked the Google window. Allow pop-ups and try again.",
    ],
    "auth/popup-closed-by-user": [
      "ยกเลิกการเข้าสู่ระบบแล้ว คุณสามารถลองใหม่ได้เมื่อพร้อม",
      "Sign-in was cancelled. You can try again when ready.",
    ],
    "auth/cancelled-popup-request": [
      "มีหน้าต่างเข้าสู่ระบบเปิดอยู่แล้ว กรุณาใช้หน้าต่างนั้น",
      "A sign-in window is already open. Please continue there.",
    ],
    "auth/unauthorized-domain": [
      "Firebase ยังไม่อนุญาตโดเมนนี้ ต้องเพิ่มโดเมน GitHub Pages ใน Authorized Domains",
      "Firebase does not allow this domain yet. Add the GitHub Pages domain to Authorized Domains.",
    ],
    "auth/network-request-failed": [
      "เชื่อมต่อ Google ไม่สำเร็จ กรุณาตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง",
      "Could not reach Google. Check your connection and try again.",
    ],
  };

  return (
    messages[code] || [
      `เข้าสู่ระบบไม่สำเร็จ (${code}) กรุณาลองอีกครั้ง`,
      `Sign-in failed (${code}). Please try again.`,
    ]
  );
}

function renderSession(session) {
  activeSession = session;
  renderAccount(session);
  renderPresence(activePresence);

  if (session.status === "loading") {
    showLogin(true);
    setAuthBusy(true);
    setAuthNotice(
      "กำลังตรวจสอบบัญชีที่เคยเข้าสู่ระบบ",
      "Checking your saved account",
    );
    return;
  }

  setAuthBusy(false);

  if (session.status === "signed-in" || session.status === "guest") {
    authNotice.hidden = true;
    showHub();
    return;
  }

  showLogin();
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
  setPresenceContext({ sectionId });
}

prepareSubjectPanels();
setLanguage(currentLanguage);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

googleButton.addEventListener("click", async () => {
  setAuthBusy(true);
  setAuthNotice("กำลังเปิดหน้าต่าง Google", "Opening Google Sign-In");

  try {
    await signInWithGoogle();
  } catch (error) {
    const [messageTh, messageEn] = authErrorMessage(error);
    setAuthBusy(false);
    setAuthNotice(messageTh, messageEn, "error");
  }
});

guestButton.addEventListener("click", async () => {
  setAuthBusy(true);
  try {
    await stopPresence();
    await continueAsGuest();
  } catch (error) {
    console.warn("Learning Hub could not start guest mode.", error);
    setAuthBusy(false);
    setAuthNotice(
      "เปิดโหมดผู้เยี่ยมชมไม่สำเร็จ กรุณาลองอีกครั้ง",
      "Could not start guest mode. Please try again.",
      "error",
    );
  }
});

signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  try {
    await stopPresence();
    await signOutFromHub();
  } catch (error) {
    console.warn("Learning Hub could not sign out.", error);
    renderSession(activeSession);
    const message =
      currentLanguage === "th"
        ? "ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง"
        : "Could not sign out. Please try again.";
    accountChip.classList.add("has-error");
    accountChip.setAttribute("title", message);
    accountDetail.textContent = message;
  } finally {
    signOutButton.disabled = false;
  }
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

presenceButton.addEventListener("click", () => {
  if (presencePanel.hidden) {
    openPresencePanel();
  } else {
    closePresencePanel();
  }
});

presenceClose.addEventListener("click", closePresencePanel);
presenceBackdrop.addEventListener("click", closePresencePanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !presencePanel.hidden) closePresencePanel();
});

document.querySelectorAll(".brand").forEach((brandLink) => {
  brandLink.addEventListener("click", (event) => event.preventDefault());
});

accountAvatar.addEventListener("error", () => {
  if (accountAvatar.src !== fallbackAvatar) accountAvatar.src = fallbackAvatar;
});

subscribeAuth(renderSession);
subscribePresence(renderPresence);

setInterval(() => {
  if (!presencePanel.hidden) renderPresence(activePresence);
}, 30_000);
