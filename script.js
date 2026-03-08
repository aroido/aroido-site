(() => {
  "use strict";

  const DEFAULT_LANGUAGE = "en";
  const LANGUAGE_KEY = "aroido:language";
  const SUPPORTED_LANGUAGES = ["en", "ko"];
  const RELEASE_PERMALINK_BASE = "https://gitlab.com/aroido/vibesmith/-/releases/permalink/latest";

  const fallbackTranslations = {
    en: {
      page_title: "Aroido | Hip Product Studio",
      meta_description:
        "Aroido designs and ships bold products with VibeSmith as the current flagship.",
      hello_alert: "Aroido readiness check is complete.",
    },
    ko: {
      page_title: "Aroido | 힙한 프로덕트 스튜디오",
      meta_description: "Aroido는 VibeSmith를 중심으로 빠르게 제품을 설계하고 출시합니다.",
      hello_alert: "Aroido 준비 상태 점검이 완료되었습니다.",
    },
  };

  const dom = {
    metaDescription: document.getElementById("metaDescription"),
    ogTitle: document.querySelector('meta[property="og:title"]'),
    ogDescription: document.querySelector('meta[property="og:description"]'),
    ogLocale: document.querySelector('meta[property="og:locale"]'),
    twitterTitle: document.querySelector('meta[name="twitter:title"]'),
    twitterDescription: document.querySelector('meta[name="twitter:description"]'),
    langButtons: Array.from(document.querySelectorAll(".lang-btn")),
    releaseDownloadNodes: Array.from(document.querySelectorAll("[data-release-download-path]")),
    trackedNodes: Array.from(document.querySelectorAll("[data-track-event]")),
    voiceTabs: Array.from(document.querySelectorAll("[data-voice-tab]")),
    voicePanels: Array.from(document.querySelectorAll("[data-voice-panel]")),
    revealNodes: Array.from(document.querySelectorAll("[data-reveal]")),
    translatableNodes: Array.from(document.querySelectorAll("[data-i18n]")),
    topbar: document.querySelector(".topbar"),
    inPageLinks: Array.from(document.querySelectorAll('a[href^="#"]')).filter((node) => {
      const href = node.getAttribute("href");
      return typeof href === "string" && href.length > 1 && !node.classList.contains("skip-link");
    }),
  };

  const titleKey = document.documentElement.getAttribute("data-title-key") || "page_title";
  const descriptionKey =
    document.documentElement.getAttribute("data-description-key") || "meta_description";

  const state = {
    currentLanguage: DEFAULT_LANGUAGE,
    translations: fallbackTranslations,
  };

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function normalizeLanguage(value) {
    if (!value || typeof value !== "string") {
      return DEFAULT_LANGUAGE;
    }

    const lower = value.toLowerCase();
    const detected = SUPPORTED_LANGUAGES.find((language) => lower.startsWith(language));
    return detected || DEFAULT_LANGUAGE;
  }

  function getQueryLanguage() {
    try {
      const raw = new URLSearchParams(window.location.search).get("lang");
      if (!raw || typeof raw !== "string") {
        return null;
      }

      const lower = raw.toLowerCase();
      const match = SUPPORTED_LANGUAGES.find((language) => lower.startsWith(language));
      return match || null;
    } catch (_error) {
      return null;
    }
  }

  function syncLanguageQuery(language) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      const query = url.searchParams.toString();
      const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
      window.history.replaceState(null, "", nextUrl);
    } catch (_error) {
      /* Ignore URL write errors in restricted contexts */
    }
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

  function setCurrentLanguage(language) {
    state.currentLanguage = normalizeLanguage(language);
  }

  function getCurrentLanguage() {
    return state.currentLanguage;
  }

  function setTranslations(translations) {
    if (!isPlainObject(translations)) {
      return;
    }
    state.translations = translations;
  }

  function getTranslationsState() {
    return state.translations;
  }

  function getTranslationsForLanguage(language) {
    const translations = getTranslationsState();
    return translations[language] || {};
  }

  function getLocaleForLanguage(language) {
    return language === "ko" ? "ko_KR" : "en_US";
  }

  function getTranslation(language, key) {
    const languageTable = getTranslationsForLanguage(language);
    const defaultTable = getTranslationsForLanguage(DEFAULT_LANGUAGE);

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

    if (dom.ogTitle && pageTitle) {
      dom.ogTitle.setAttribute("content", pageTitle);
    }

    if (dom.twitterTitle && pageTitle) {
      dom.twitterTitle.setAttribute("content", pageTitle);
    }

    if (dom.ogDescription && metaCopy) {
      dom.ogDescription.setAttribute("content", metaCopy);
    }

    if (dom.twitterDescription && metaCopy) {
      dom.twitterDescription.setAttribute("content", metaCopy);
    }

    if (dom.ogLocale) {
      dom.ogLocale.setAttribute("content", getLocaleForLanguage(language));
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

  function buildReleaseDownloadUrl(assetPath) {
    if (!assetPath || typeof assetPath !== "string") {
      return null;
    }

    const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    return `${RELEASE_PERMALINK_BASE}/downloads${normalizedPath}`;
  }

  function initializeReleaseDownloadLinks() {
    if (dom.releaseDownloadNodes.length === 0) {
      return;
    }

    dom.releaseDownloadNodes.forEach((node) => {
      const assetPath = node.getAttribute("data-release-download-path");
      const href = buildReleaseDownloadUrl(assetPath);
      if (href) {
        node.setAttribute("href", href);
      }
    });
  }

  function applyLanguage(language, options = {}) {
    const { syncQuery = true } = options;
    const nextLanguage = normalizeLanguage(language);

    document.documentElement.lang = nextLanguage;
    updateHeadMetadata(nextLanguage);
    updateTextNodes(nextLanguage);
    updateLanguageButtons(nextLanguage);

    setCurrentLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);

    if (syncQuery) {
      syncLanguageQuery(nextLanguage);
    }
  }

  function initializeLanguage() {
    const preferred = getQueryLanguage() || getStoredLanguage() || navigator.language || DEFAULT_LANGUAGE;
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

  function trackEvent(name, properties = {}) {
    if (!name || typeof name !== "string") {
      return;
    }

    const payload = {
      page_path: window.location.pathname,
      language: getCurrentLanguage(),
      ...properties,
    };

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
  }

  function initializeTrackedEvents() {
    if (dom.trackedNodes.length === 0) {
      return;
    }

    dom.trackedNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const eventName = node.getAttribute("data-track-event");
        if (!eventName) {
          return;
        }

        trackEvent(eventName, {
          label: node.getAttribute("data-track-label") || "",
          target: node.getAttribute("href") || node.id || node.tagName.toLowerCase(),
        });
      });
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

  function initializeVoicePanels() {
    if (dom.voiceTabs.length === 0 || dom.voicePanels.length === 0) {
      return;
    }

    const panelById = new Map();
    dom.voicePanels.forEach((panel) => {
      const id = panel.getAttribute("data-voice-panel");
      if (id) {
        panelById.set(id, panel);
      }
    });

    const tabs = dom.voiceTabs.filter((tab) => {
      const id = tab.getAttribute("data-voice-tab");
      return typeof id === "string" && panelById.has(id);
    });

    if (tabs.length === 0) {
      return;
    }

    const initialTab =
      tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    const initialId = initialTab.getAttribute("data-voice-tab");

    function activateVoicePanel(panelId, shouldFocus = false, shouldTrack = false) {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute("data-voice-tab") === panelId;
        tab.setAttribute("aria-selected", String(isActive));
        tab.setAttribute("tabindex", isActive ? "0" : "-1");
        tab.classList.toggle("is-active", isActive);
        if (isActive && shouldFocus) {
          tab.focus();
        }
      });

      dom.voicePanels.forEach((panel) => {
        const isActive = panel.getAttribute("data-voice-panel") === panelId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });

      if (shouldTrack) {
        trackEvent("voice_tab_switch", { tab_id: panelId });
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        const panelId = tab.getAttribute("data-voice-tab");
        if (panelId) {
          activateVoicePanel(panelId, false, true);
        }
      });

      tab.addEventListener("keydown", (event) => {
        const lastIndex = tabs.length - 1;
        let nextIndex = null;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = index === lastIndex ? 0 : index + 1;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = index === 0 ? lastIndex : index - 1;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = lastIndex;
        }

        if (nextIndex === null) {
          return;
        }

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        const panelId = nextTab.getAttribute("data-voice-tab");
        if (panelId) {
          activateVoicePanel(panelId, true, true);
        }
      });
    });

    if (initialId) {
      activateVoicePanel(initialId);
    }
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

  function getHashTarget(hash) {
    return document.querySelector(hash);
  }

  function scrollToHashTarget(hash, behavior = "smooth") {
    if (!hash || hash === "#") {
      return;
    }

    const target = getHashTarget(hash);
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

        const target = getHashTarget(hash);
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
    return isPlainObject(table);
  }

  function isValidTranslationsPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return false;
    }

    return SUPPORTED_LANGUAGES.every((language) => isValidTranslationTable(payload[language]));
  }

  async function fetchTranslationsPayload() {
    try {
      const response = await fetch("/i18n/messages.json", { cache: "no-store" });
      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      return isValidTranslationsPayload(payload) ? payload : null;
    } catch (_error) {
      /* Keep fallback translations when external file cannot be loaded */
      return null;
    }
  }

  async function loadTranslations() {
    const payload = await fetchTranslationsPayload();
    if (payload) {
      setTranslations(payload);
    }
  }

  function reapplyCurrentLanguage() {
    applyLanguage(getCurrentLanguage(), { syncQuery: false });
  }

  function runSynchronousBootstrap() {
    initializeReleaseDownloadLinks();
    initializeTrackedEvents();
    initializeLanguageSwitch();
    initializeVoicePanels();
    initializeRevealMotion();
    initializeAnchorOffsets();
    initializeLanguage();
  }

  function runAsynchronousBootstrap() {
    loadTranslations().finally(reapplyCurrentLanguage);
  }

  function initialize() {
    runSynchronousBootstrap();
    runAsynchronousBootstrap();
  }

  initialize();
})();
