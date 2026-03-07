(() => {
  "use strict";

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

  const dom = {
    helloBtn: document.getElementById("helloBtn"),
    metaDescription: document.getElementById("metaDescription"),
    langButtons: Array.from(document.querySelectorAll(".lang-btn")),
    revealNodes: Array.from(document.querySelectorAll("[data-reveal]")),
    translatableNodes: Array.from(document.querySelectorAll("[data-i18n]")),
    topbar: document.querySelector(".topbar"),
    inPageLinks: Array.from(document.querySelectorAll('a[href^="#"]')).filter((node) => {
      const href = node.getAttribute("href");
      return typeof href === "string" && href.length > 1;
    }),
  };

  const titleKey = document.documentElement.getAttribute("data-title-key") || "page_title";
  const descriptionKey =
    document.documentElement.getAttribute("data-description-key") || "meta_description";

  const state = {
    currentLanguage: DEFAULT_LANGUAGE,
    translations: fallbackTranslations,
  };

  function normalizeLanguage(value) {
    if (!value || typeof value !== "string") {
      return DEFAULT_LANGUAGE;
    }

    const lower = value.toLowerCase();
    const detected = SUPPORTED_LANGUAGES.find((language) => lower.startsWith(language));
    return detected || DEFAULT_LANGUAGE;
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_KEY);
    } catch (_error) {
      return null;
    }
  }

  function setStoredLanguage(language) {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (_error) {
      /* Ignore storage errors in private mode/restricted contexts */
    }
  }

  function getTranslation(language, key) {
    const languageTable = state.translations[language] || {};
    const defaultTable = state.translations[DEFAULT_LANGUAGE] || {};

    if (Object.prototype.hasOwnProperty.call(languageTable, key)) {
      return languageTable[key];
    }

    if (Object.prototype.hasOwnProperty.call(defaultTable, key)) {
      return defaultTable[key];
    }

    return undefined;
  }

  function updateHeadMetadata(language) {
    const pageTitle = getTranslation(language, titleKey) || getTranslation(language, "page_title");
    if (pageTitle) {
      document.title = pageTitle;
    }

    const metaCopy =
      getTranslation(language, descriptionKey) || getTranslation(language, "meta_description");
    if (dom.metaDescription && metaCopy) {
      dom.metaDescription.setAttribute("content", metaCopy);
    }
  }

  function updateTextNodes(language) {
    dom.translatableNodes.forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (!key) {
        return;
      }

      const value = getTranslation(language, key);
      if (typeof value === "string" && value.length > 0) {
        node.textContent = value;
      }
    });
  }

  function updateLanguageButtons(language) {
    dom.langButtons.forEach((button) => {
      const buttonLanguage = button.getAttribute("data-lang");
      const isActive = buttonLanguage === language;
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyLanguage(language) {
    const nextLanguage = normalizeLanguage(language);

    document.documentElement.lang = nextLanguage;
    updateHeadMetadata(nextLanguage);
    updateTextNodes(nextLanguage);
    updateLanguageButtons(nextLanguage);

    state.currentLanguage = nextLanguage;
    setStoredLanguage(nextLanguage);
  }

  function initializeLanguage() {
    const preferred = getStoredLanguage() || navigator.language || DEFAULT_LANGUAGE;
    applyLanguage(preferred);
  }

  function initializeLanguageSwitch() {
    dom.langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextLanguage = button.getAttribute("data-lang");
        applyLanguage(nextLanguage);
      });
    });
  }

  function initializeHelloButton() {
    if (!dom.helloBtn) {
      return;
    }

    dom.helloBtn.addEventListener("click", () => {
      const fallback = fallbackTranslations.en.hello_alert;
      alert(getTranslation(state.currentLanguage, "hello_alert") || fallback);
    });
  }

  function initializeRevealMotion() {
    if (dom.revealNodes.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      dom.revealNodes.forEach((node) => node.classList.add("is-visible"));
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

    dom.revealNodes.forEach((node) => observer.observe(node));
  }

  function getAnchorOffset() {
    if (!dom.topbar) {
      return 16;
    }

    const style = window.getComputedStyle(dom.topbar);
    if (style.position !== "sticky" && style.position !== "fixed") {
      return 16;
    }

    const stickyTop = Number.parseFloat(style.top) || 0;
    const height = dom.topbar.getBoundingClientRect().height || 0;
    return Math.ceil(height + stickyTop + 12);
  }

  function scrollToHashTarget(hash, behavior = "smooth") {
    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offsetTop = Math.max(0, targetTop - getAnchorOffset());
    window.scrollTo({ top: offsetTop, behavior });
  }

  function initializeAnchorOffsets() {
    dom.inPageLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash) {
          return;
        }

        const target = document.querySelector(hash);
        if (!target) {
          return;
        }

        event.preventDefault();
        scrollToHashTarget(hash, "smooth");
        history.replaceState(null, "", hash);
      });
    });

    window.addEventListener("hashchange", () => {
      scrollToHashTarget(window.location.hash, "auto");
    });

    if (window.location.hash) {
      setTimeout(() => {
        scrollToHashTarget(window.location.hash, "auto");
      }, 0);
    }
  }

  function isValidTranslationTable(table) {
    return table && typeof table === "object";
  }

  function isValidTranslationsPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return false;
    }

    return SUPPORTED_LANGUAGES.every((language) => isValidTranslationTable(payload[language]));
  }

  async function loadTranslations() {
    try {
      const response = await fetch("/i18n/messages.json", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (isValidTranslationsPayload(data)) {
        state.translations = data;
      }
    } catch (_error) {
      /* Keep fallback translations when external file cannot be loaded */
    }
  }

  function initialize() {
    initializeLanguageSwitch();
    initializeHelloButton();
    initializeRevealMotion();
    initializeAnchorOffsets();
    initializeLanguage();

    loadTranslations().finally(() => {
      applyLanguage(state.currentLanguage);
    });
  }

  initialize();
})();
