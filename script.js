const DEFAULT_LANGUAGE = "en";
const LANGUAGE_KEY = "aroido:language";
const SUPPORTED_LANGUAGES = ["en", "ko"];

const fallbackTranslations = {
  en: {
    page_title: "Aroido | Hip Product Studio",
    meta_description:
      "Aroido designs and ships bold products with Vibesmith as the current flagship.",
    hello_alert: "Aroido readiness check is complete.",
  },
  ko: {
    page_title: "Aroido | 힙한 프로덕트 스튜디오",
    meta_description: "Aroido는 VibeSmith를 중심으로 빠르게 제품을 설계하고 출시합니다.",
    hello_alert: "Aroido 준비 상태 점검이 완료되었습니다.",
  },
};

const helloBtn = document.getElementById("helloBtn");
const metaDescription = document.getElementById("metaDescription");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

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
  const languageTable = translations[language] || {};
  const defaultTable = translations[DEFAULT_LANGUAGE] || {};

  if (Object.prototype.hasOwnProperty.call(languageTable, key)) {
    return languageTable[key];
  }

  if (Object.prototype.hasOwnProperty.call(defaultTable, key)) {
    return defaultTable[key];
  }

  return undefined;
}

function applyLanguage(language) {
  const nextLanguage = normalizeLanguage(language);

  document.documentElement.lang = nextLanguage;

  const pageTitle = translate(nextLanguage, "page_title");
  if (pageTitle) {
    document.title = pageTitle;
  }

  const metaCopy = translate(nextLanguage, "meta_description");
  if (metaDescription && metaCopy) {
    metaDescription.setAttribute("content", metaCopy);
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = translate(nextLanguage, key);

    if (typeof value === "string" && value.length > 0) {
      node.textContent = value;
    }
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

function initializeRevealMotion() {
  if (revealNodes.length === 0) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof IntersectionObserver === "undefined") {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

async function loadTranslations() {
  try {
    const response = await fetch("/i18n/messages.json", { cache: "no-store" });
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
    alert(translate(currentLanguage, "hello_alert") || fallbackTranslations.en.hello_alert);
  });
}

loadTranslations().finally(() => {
  initializeLanguage();
  initializeRevealMotion();
});
