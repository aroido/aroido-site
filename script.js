(() => {
  "use strict";

  const DEFAULT_LANGUAGE = "en";
  const LANGUAGE_KEY = "aroido:language";
  const DEBUG_LANGUAGE_KEY = "aroido:debug-language";
  const DEBUG_LANGUAGE_QUERY_KEY = "debug_lang";
  const THEME_MODE_KEY = "aroido:theme-mode";
  const DEFAULT_THEME_MODE = "auto";
  const SUPPORTED_THEME_MODES = ["auto", "light", "dark"];
  const SUPPORTED_LANGUAGES = ["en", "ko"];
  const COMMUNITY_RELEASE_PERMALINK =
    "https://gitlab.com/aroido/vibesmith-community/-/releases/permalink/latest";
  const COMMUNITY_RELEASE_API_URL =
    "https://gitlab.com/api/v4/projects/aroido%2Fvibesmith-community/releases/permalink/latest";
  const COMMUNITY_ARCHIVE_URL = COMMUNITY_RELEASE_PERMALINK;
  const COMMUNITY_REPOSITORY_URL = "https://gitlab.com/aroido/vibesmith-community";
  const COMMUNITY_LINK_CACHE_KEY = "aroido:community-links";
  const COMMUNITY_LINK_CACHE_TTL_MS = 30 * 60 * 1000;

  const fallbackTranslations = {
    en: {
      page_title: "Aroido | Hip Product Studio",
      meta_description:
        "Aroido designs and ships bold products with VibeSmith as the current flagship.",
      hello_alert: "Aroido readiness check is complete.",
      theme_auto: "Auto",
      theme_light: "Light",
      theme_dark: "Dark",
    },
    ko: {
      page_title: "Aroido | 힙한 프로덕트 스튜디오",
      meta_description: "Aroido는 VibeSmith를 중심으로 빠르게 제품을 설계하고 출시합니다.",
      hello_alert: "Aroido 준비 상태 점검이 완료되었습니다.",
      theme_auto: "시스템",
      theme_light: "라이트",
      theme_dark: "다크",
    },
  };

  const dom = {
    metaDescription: document.getElementById("metaDescription"),
    ogTitle: document.querySelector('meta[property="og:title"]'),
    ogDescription: document.querySelector('meta[property="og:description"]'),
    ogLocale: document.querySelector('meta[property="og:locale"]'),
    twitterTitle: document.querySelector('meta[name="twitter:title"]'),
    twitterDescription: document.querySelector('meta[name="twitter:description"]'),
    themeButtons: Array.from(document.querySelectorAll(".theme-btn")),
    brandMarks: Array.from(document.querySelectorAll(".brand-mark[data-mark-light][data-mark-dark]")),
    langSwitchNodes: Array.from(document.querySelectorAll(".lang-switch")),
    langButtons: Array.from(document.querySelectorAll(".lang-btn")),
    communityLinkNodes: Array.from(document.querySelectorAll("[data-community-link]")),
    communityReleaseUrlNode: document.querySelector("[data-community-release-url]"),
    communityArchiveUrlNode: document.querySelector("[data-community-archive-url]"),
    communityRepositoryUrlNode: document.querySelector("[data-community-repository-url]"),
    localizedMediaNodes: Array.from(document.querySelectorAll("[data-media-src-en][data-media-src-ko]")),
    trackedNodes: Array.from(document.querySelectorAll("[data-track-event]")),
    voiceTabs: Array.from(document.querySelectorAll("[data-voice-tab]")),
    voicePanels: Array.from(document.querySelectorAll("[data-voice-panel]")),
    revealNodes: Array.from(document.querySelectorAll("[data-reveal]")),
    translatableNodes: Array.from(document.querySelectorAll("[data-i18n]")),
    translatableAriaLabelNodes: Array.from(document.querySelectorAll("[data-i18n-aria-label]")),
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
    currentThemeMode: DEFAULT_THEME_MODE,
    debugLanguage: null,
  };

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
  }

  function normalizeLanguage(value) {
    if (!value || typeof value !== "string") {
      return DEFAULT_LANGUAGE;
    }

    const lower = value.toLowerCase();
    const detected = SUPPORTED_LANGUAGES.find((language) => lower.startsWith(language));
    return detected || DEFAULT_LANGUAGE;
  }

  function normalizeDebugLanguage(value) {
    if (!value || typeof value !== "string") {
      return null;
    }

    const lower = value.toLowerCase();
    if (lower.startsWith("ko")) {
      return "ko";
    }

    return null;
  }

  function normalizeThemeMode(value) {
    if (!value || typeof value !== "string") {
      return DEFAULT_THEME_MODE;
    }

    const lower = value.toLowerCase();
    return SUPPORTED_THEME_MODES.includes(lower) ? lower : DEFAULT_THEME_MODE;
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function resolveTheme(themeMode) {
    const nextMode = normalizeThemeMode(themeMode);
    return nextMode === "auto" ? getSystemTheme() : nextMode;
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

  function getQueryDebugLanguageDirective() {
    try {
      const raw = new URLSearchParams(window.location.search).get(DEBUG_LANGUAGE_QUERY_KEY);
      if (!raw || typeof raw !== "string") {
        return null;
      }

      const lower = raw.toLowerCase();
      if (lower === "off" || lower === "false" || lower === "0") {
        return "off";
      }

      return normalizeDebugLanguage(lower);
    } catch (_error) {
      return null;
    }
  }

  function syncLanguageQuery(language) {
    try {
      const url = new URL(window.location.href);
      const nextLanguage = normalizeLanguage(language);
      if (nextLanguage === DEFAULT_LANGUAGE) {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", nextLanguage);
      }
      url.searchParams.delete(DEBUG_LANGUAGE_QUERY_KEY);
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

  function getStoredDebugLanguage() {
    try {
      return sessionStorage.getItem(DEBUG_LANGUAGE_KEY);
    } catch (_error) {
      return null;
    }
  }

  function setStoredDebugLanguage(language) {
    try {
      sessionStorage.setItem(DEBUG_LANGUAGE_KEY, language);
    } catch (_error) {
      /* Ignore storage errors in private mode/restricted contexts */
    }
  }

  function clearStoredDebugLanguage() {
    try {
      sessionStorage.removeItem(DEBUG_LANGUAGE_KEY);
    } catch (_error) {
      /* Ignore storage errors in private mode/restricted contexts */
    }
  }

  function getStoredThemeMode() {
    try {
      return localStorage.getItem(THEME_MODE_KEY);
    } catch (_error) {
      return null;
    }
  }

  function setStoredThemeMode(themeMode) {
    try {
      localStorage.setItem(THEME_MODE_KEY, themeMode);
    } catch (_error) {
      /* Ignore storage errors in private mode/restricted contexts */
    }
  }

  function getCachedCommunityLinks() {
    try {
      const raw = localStorage.getItem(COMMUNITY_LINK_CACHE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!isPlainObject(parsed)) {
        return null;
      }

      const releaseUrl = parsed.releaseUrl;
      const packageUrl = parsed.packageUrl;
      const fetchedAt = Number(parsed.fetchedAt);

      if (!isNonEmptyString(releaseUrl) || !isNonEmptyString(packageUrl)) {
        return null;
      }

      if (!Number.isFinite(fetchedAt)) {
        return null;
      }

      if (Date.now() - fetchedAt > COMMUNITY_LINK_CACHE_TTL_MS) {
        return null;
      }

      return { releaseUrl, packageUrl };
    } catch (_error) {
      return null;
    }
  }

  function setCachedCommunityLinks(releaseUrl, packageUrl) {
    try {
      if (!isNonEmptyString(releaseUrl) || !isNonEmptyString(packageUrl)) {
        return;
      }

      localStorage.setItem(
        COMMUNITY_LINK_CACHE_KEY,
        JSON.stringify({
          releaseUrl,
          packageUrl,
          fetchedAt: Date.now(),
        })
      );
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

  function setCurrentThemeMode(themeMode) {
    state.currentThemeMode = normalizeThemeMode(themeMode);
  }

  function getCurrentThemeMode() {
    return state.currentThemeMode;
  }

  function setDebugLanguage(language) {
    state.debugLanguage = normalizeDebugLanguage(language);
  }

  function getDebugLanguage() {
    return state.debugLanguage;
  }

  function isDebugLanguageEnabled() {
    return getDebugLanguage() === "ko";
  }

  function initializeDebugLanguageMode() {
    const debugDirective = getQueryDebugLanguageDirective();
    if (debugDirective === "off") {
      clearStoredDebugLanguage();
    } else if (debugDirective) {
      setStoredDebugLanguage(debugDirective);
    }

    setDebugLanguage(getStoredDebugLanguage());
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

  function updateAriaLabelNodes(language) {
    dom.translatableAriaLabelNodes.forEach((node) => {
      const key = node.getAttribute("data-i18n-aria-label");
      if (!key) {
        return;
      }

      const value = getTranslation(language, key);
      if (isNonEmptyString(value)) {
        node.setAttribute("aria-label", value);
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

  function updateLanguageSwitchVisibility(isVisible) {
    dom.langSwitchNodes.forEach((node) => {
      node.hidden = !isVisible;
      node.setAttribute("aria-hidden", String(!isVisible));
    });
  }

  function updateThemeButtons(themeMode) {
    if (dom.themeButtons.length === 0) {
      return;
    }

    const nextMode = normalizeThemeMode(themeMode);
    dom.themeButtons.forEach((button) => {
      const mode = normalizeThemeMode(button.getAttribute("data-theme-mode"));
      button.setAttribute("aria-pressed", String(mode === nextMode));
    });
  }

  function updateBrandMarks(resolvedTheme) {
    if (!Array.isArray(dom.brandMarks) || dom.brandMarks.length === 0) {
      return;
    }

    dom.brandMarks.forEach((mark) => {
      const nextSource =
        resolvedTheme === "dark"
          ? mark.getAttribute("data-mark-light")
          : mark.getAttribute("data-mark-dark");

      if (nextSource) {
        mark.setAttribute("src", nextSource);
      }
    });
  }

  function setCommunityLink(type, href) {
    dom.communityLinkNodes.forEach((node) => {
      if (node.getAttribute("data-community-link") === type) {
        node.setAttribute("href", href);
      }
    });
  }

  function updateCommunityPathNode(node, href) {
    if (!node || !href) {
      return;
    }

    node.setAttribute("href", href);
    node.textContent = href;
  }

  function applyCommunityLinks(releaseUrl, packageUrl) {
    if (!isNonEmptyString(releaseUrl) || !isNonEmptyString(packageUrl)) {
      return;
    }

    setCommunityLink("release", releaseUrl);
    setCommunityLink("archive", packageUrl);
    setCommunityLink("repository", COMMUNITY_REPOSITORY_URL);

    updateCommunityPathNode(dom.communityReleaseUrlNode, releaseUrl);
    updateCommunityPathNode(dom.communityArchiveUrlNode, packageUrl);
    updateCommunityPathNode(dom.communityRepositoryUrlNode, COMMUNITY_REPOSITORY_URL);
  }

  function initializeCommunityReleaseLinks() {
    if (dom.communityLinkNodes.length === 0) {
      return;
    }

    applyCommunityLinks(COMMUNITY_RELEASE_PERMALINK, COMMUNITY_ARCHIVE_URL);
  }

  function normalizeGitLabUrl(url) {
    if (!isNonEmptyString(url)) {
      return null;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("/")) {
      return `https://gitlab.com${url}`;
    }

    return null;
  }

  function getLatestPackageUrl(payload) {
    const links = payload?.assets?.links;
    if (!Array.isArray(links) || links.length === 0) {
      return null;
    }

    const candidates = links
      .map((link) => {
        const name = String(link?.name || "");
        const direct = normalizeGitLabUrl(link?.direct_asset_url);
        const fallback = normalizeGitLabUrl(link?.url);
        return {
          name,
          url: direct || fallback,
        };
      })
      .filter((link) => isNonEmptyString(link.url) && isNonEmptyString(link.name));

    const dmg = candidates.find(
      (link) => /\.dmg$/i.test(link.name) && !/blockmap/i.test(link.name)
    );
    if (dmg) {
      return dmg.url;
    }

    const zip = candidates.find(
      (link) =>
        /\.zip$/i.test(link.name) &&
        /vibesmith/i.test(link.name) &&
        !/blockmap/i.test(link.name)
    );
    if (zip) {
      return zip.url;
    }

    const genericZip = candidates.find(
      (link) => /\.zip$/i.test(link.name) && !/blockmap/i.test(link.name)
    );
    return genericZip ? genericZip.url : null;
  }

  function applyLatestCommunityReleaseLinks(payload) {
    if (!isPlainObject(payload)) {
      return null;
    }

    const releaseUrl = normalizeGitLabUrl(payload?._links?.self) || COMMUNITY_RELEASE_PERMALINK;
    const packageUrl = getLatestPackageUrl(payload) || COMMUNITY_ARCHIVE_URL;

    applyCommunityLinks(releaseUrl, packageUrl);
    return { releaseUrl, packageUrl };
  }

  async function fetchLatestCommunityReleasePayload() {
    try {
      const response = await fetch(COMMUNITY_RELEASE_API_URL, { cache: "no-store" });
      if (!response.ok) {
        return null;
      }
      const payload = await response.json();
      return isPlainObject(payload) ? payload : null;
    } catch (_error) {
      return null;
    }
  }

  async function refreshCommunityReleaseLinks() {
    if (dom.communityLinkNodes.length === 0) {
      return;
    }

    const cached = getCachedCommunityLinks();
    if (cached) {
      applyCommunityLinks(cached.releaseUrl, cached.packageUrl);
      return;
    }

    const payload = await fetchLatestCommunityReleasePayload();
    if (payload) {
      const latestLinks = applyLatestCommunityReleaseLinks(payload);
      if (latestLinks) {
        setCachedCommunityLinks(latestLinks.releaseUrl, latestLinks.packageUrl);
      }
    }
  }

  function applyLocalizedMedia(language) {
    if (!Array.isArray(dom.localizedMediaNodes) || dom.localizedMediaNodes.length === 0) {
      return;
    }

    const nextLanguage = normalizeLanguage(language);
    const attribute = nextLanguage === "ko" ? "data-media-src-ko" : "data-media-src-en";

    dom.localizedMediaNodes.forEach((node) => {
      const nextSrc = node.getAttribute(attribute);
      if (nextSrc && node.getAttribute("src") !== nextSrc) {
        node.setAttribute("src", nextSrc);
      }
    });
  }

  function applyLanguage(language, options = {}) {
    const { syncQuery = true } = options;
    const requestedLanguage = normalizeLanguage(language);
    const nextLanguage = requestedLanguage;

    document.documentElement.lang = nextLanguage;
    updateHeadMetadata(nextLanguage);
    updateTextNodes(nextLanguage);
    updateAriaLabelNodes(nextLanguage);
    updateLanguageButtons(nextLanguage);
    applyLocalizedMedia(nextLanguage);

    setCurrentLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);

    if (syncQuery) {
      syncLanguageQuery(nextLanguage);
    }
  }

  function initializeLanguage() {
    const preferred =
      getQueryLanguage() || getStoredLanguage() || normalizeLanguage(navigator.language);
    applyLanguage(preferred);
  }

  function initializeLanguageSwitch() {
    updateLanguageSwitchVisibility(true);

    dom.langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextLanguage = button.getAttribute("data-lang");
        applyLanguage(nextLanguage);
      });
    });
  }

  function applyTheme(themeMode, options = {}) {
    const { persist = true } = options;
    const nextMode = normalizeThemeMode(themeMode);
    const resolvedTheme = resolveTheme(nextMode);

    document.documentElement.setAttribute("data-theme-mode", nextMode);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    setCurrentThemeMode(nextMode);
    updateThemeButtons(nextMode);
    updateBrandMarks(resolvedTheme);

    if (persist) {
      setStoredThemeMode(nextMode);
    }
  }

  function initializeThemeSwitch() {
    if (dom.themeButtons.length > 0) {
      dom.themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const nextMode = button.getAttribute("data-theme-mode");
          applyTheme(nextMode);
          trackEvent("theme_mode_change", { theme_mode: normalizeThemeMode(nextMode) });
        });
      });
    }

    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if (getCurrentThemeMode() === "auto") {
        applyTheme("auto", { persist: false });
      }
    };

    if (typeof darkMediaQuery.addEventListener === "function") {
      darkMediaQuery.addEventListener("change", syncSystemTheme);
    } else if (typeof darkMediaQuery.addListener === "function") {
      darkMediaQuery.addListener(syncSystemTheme);
    }

    const storedThemeMode = getStoredThemeMode();
    applyTheme(storedThemeMode || DEFAULT_THEME_MODE, { persist: false });
  }

  function trackEvent(name, properties = {}) {
    if (!name || typeof name !== "string") {
      return;
    }

    const payload = {
      page_path: window.location.pathname,
      language: getCurrentLanguage(),
      theme_mode: getCurrentThemeMode(),
      theme: document.documentElement.getAttribute("data-theme") || "light",
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
    initializeDebugLanguageMode();
    initializeCommunityReleaseLinks();
    initializeThemeSwitch();
    initializeTrackedEvents();
    initializeLanguageSwitch();
    initializeVoicePanels();
    initializeRevealMotion();
    initializeAnchorOffsets();
    initializeLanguage();
  }

  function runAsynchronousBootstrap() {
    loadTranslations().finally(reapplyCurrentLanguage);
    refreshCommunityReleaseLinks();
  }

  function initialize() {
    runSynchronousBootstrap();
    runAsynchronousBootstrap();
  }

  initialize();
})();
