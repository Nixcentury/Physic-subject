const supportedLanguages = new Set(["th", "en"]);

function setLanguage(language) {
  const nextLanguage = supportedLanguages.has(language) ? language : "th";
  document.documentElement.lang = nextLanguage;
  document.querySelectorAll("[data-th][data-en]").forEach((element) => {
    element.textContent = element.dataset[nextLanguage];
  });
}

window.addEventListener("message", (event) => {
  if (event.source !== parent || event.data?.type !== "learning-hub-context") return;
  setLanguage(event.data.language);
});

setLanguage("th");
