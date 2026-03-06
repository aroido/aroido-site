const DEFAULT_LANGUAGE = "en";
const LANGUAGE_KEY = "aroido:language";
const SUPPORTED_LANGUAGES = ["en", "ko"];

const fallbackTranslations = {
  en: {
    page_title: "Aroido | Team and Projects",
    meta_description: "Aroido builds focused products and ships Vibesmith as a flagship project.",
    hero_title: "Aroido builds products with clear execution.",
    hero_description: "Our hub highlights team context and projects, while Vibesmith stays in focus right now.",
    focus_title: "Current Focus: Vibesmith",
    focus_description:
      "Work Session, spec-driven delivery, and measurable quality gates are now standard in this workspace.",
    cta_primary: "Run readiness check",
    hello_alert: "Aroido readiness check is complete.",
  },
  ko: {
    page_title: "Aroido | 팀과 프로젝트",
    meta_description: "Aroido는 집중도 높은 제품을 만들고, 현재 Vibesmith를 핵심 프로젝트로 운영합니다.",
    hero_title: "Aroido는 실행력이 분명한 제품을 만듭니다.",
    hero_description:
      "허브는 팀 컨텍스트와 프로젝트를 보여주고, 현재는 Vibesmith에 집중하고 있습니다.",
    focus_title: "현재 집중: Vibesmith",
    focus_description:
      "워크세션, 스펙드리븐 개발, 측정 가능한 품질 게이트를 이 워크스페이스의 기본으로 운영합니다.",
    cta_primary: "준비 상태 점검 실행",
    hello_alert: "Aroido 준비 상태 점검이 완료되었습니다.",
  },
};

const helloBtn = document.getElementById("helloBtn");
const metaDescription = document.getElementById("metaDescription");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));

let currentLanguage = DEFAULT_LANGUAGE;
let translations = fallbackTranslations;

function normalizeLanguage(value) {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  const lower = value.toLowerCase();
  const detected = SUPPORTED_LANGUAGES.find((language) => lower.startsWith(language));
  return detected || DEFAULT_LANGUAGE;
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    return null;
  }
}

function setStoredLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    /* Ignore storage errors in private mode/restricted contexts */
  }
}

function translate(language, key) {
  const languageTable = translations[language] || translations[DEFAULT_LANGUAGE];
  return languageTable[key] || translations[DEFAULT_LANGUAGE][key] || key;
}

function applyLanguage(language) {
  const nextLanguage = normalizeLanguage(language);

  document.documentElement.lang = nextLanguage;
  document.title = translate(nextLanguage, "page_title");

  if (metaDescription) {
    metaDescription.setAttribute("content", translate(nextLanguage, "meta_description"));
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = translate(nextLanguage, key);
  });

  langButtons.forEach((button) => {
    const buttonLanguage = button.getAttribute("data-lang");
    const isActive = buttonLanguage === nextLanguage;
    button.setAttribute("aria-pressed", String(isActive));
  });

  currentLanguage = nextLanguage;
  setStoredLanguage(nextLanguage);
}

function initializeLanguage() {
  const preferred = getStoredLanguage() || navigator.language || DEFAULT_LANGUAGE;
  applyLanguage(preferred);
}

async function loadTranslations() {
  try {
    const response = await fetch("./i18n/messages.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    if (data && data.en && data.ko) {
      translations = data;
    }
  } catch (error) {
    /* Keep fallback translations when external file cannot be loaded */
  }
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextLanguage = button.getAttribute("data-lang");
    applyLanguage(nextLanguage);
  });
});

if (helloBtn) {
  helloBtn.addEventListener("click", () => {
    alert(translate(currentLanguage, "hello_alert"));
  });
}

loadTranslations().finally(() => {
  initializeLanguage();
});
