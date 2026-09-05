const supportedLanguages = new Set(["th", "en"]);
const initialLanguage = new URLSearchParams(location.search).get("lang");

function setLanguage(language) {
  const nextLanguage = supportedLanguages.has(language) ? language : "th";
  document.documentElement.lang = nextLanguage;

  document.querySelectorAll("[data-th][data-en]").forEach((element) => {
    element.textContent = element.dataset[nextLanguage];
  });

  document.querySelectorAll("[data-aria-th][data-aria-en]").forEach((element) => {
    element.setAttribute(
      "aria-label",
      nextLanguage === "th" ? element.dataset.ariaTh : element.dataset.ariaEn,
    );
  });
}

function setRole(role) {
  const nextRole = ["student", "teacher", "admin"].includes(role)
    ? role
    : "student";
  document.body.dataset.role = nextRole;

  document.querySelectorAll("[data-role-view]").forEach((element) => {
    const acceptedRoles = element.dataset.roleView.split(" ");
    element.hidden = !acceptedRoles.includes(nextRole);
  });
}

window.addEventListener("message", (event) => {
  if (event.source !== parent || event.data?.type !== "learning-hub-context") return;
  setLanguage(event.data.language);
  setRole(event.data.role);
});

setLanguage(initialLanguage);
setRole("student");
parent.postMessage({ type: "learning-hub-page-ready" }, "*");
