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
  const COMMUNITY_RELEASE_PERMALINK = "https://github.com/aroido/vibesmith/releases";
  const COMMUNITY_RELEASE_API_URL =
    "https://api.github.com/repos/aroido/vibesmith/releases?per_page=10";
  const COMMUNITY_ARCHIVE_URL = COMMUNITY_RELEASE_PERMALINK;
  const COMMUNITY_REPOSITORY_URL = "https://github.com/aroido/vibesmith";
  const COMMUNITY_LINK_CACHE_KEY = "aroido:release-links:v2";
  const COMMUNITY_LINK_CACHE_TTL_MS = 30 * 60 * 1000;
  const COPY_FEEDBACK_DURATION_MS = 1800;
  const TALLY_POPUP_FORM_ID = "RG484l";
  const VERCEL_ANALYTICS_SCRIPT_PATH = "/_vercel/insights/script.js";

  const fallbackTranslations = {
    en: {
      page_title: "Aroido | AI-Native Software Across Work, Desktop, and Play",
      meta_description:
        "Aroido is an AI-native product studio shipping focused software across developer workflows, desktop utilities, and experimental play. Public now: VibeSmith and LayoutRecall.",
      home_seo_title: "Aroido | AI-Native Software Across Work, Desktop, and Play",
      home_meta_description:
        "Aroido is an AI-native product studio shipping focused software across developer workflows, desktop utilities, and experimental play. Public now: VibeSmith and LayoutRecall.",
      projects_seo_title: "Aroido Products | Public Software and Labs in Motion",
      projects_meta_description:
        "Browse Aroido's public products and labs. Public now: VibeSmith for AI coding repo drift and LayoutRecall for scrambled macOS monitor desks.",
      vibe_seo_title: "VibeSmith | Audit AI Coding Repo Drift Before It Spreads",
      vibe_meta_description:
        "VibeSmith helps multi-repo AI teams audit active components, hidden dependencies, context waste, and setup drift across Cursor and Claude Code workflows.",
      team_seo_title: "Aroido Team | Beliefs, Builders, and Product Direction",
      team_meta_description:
        "Meet the team behind Aroido: why we build this way, what we believe, and how we ship products across multiple categories.",
      contact_seo_title: "Contact Aroido | Products, Labs, and Collaboration",
      contact_meta_description:
        "Use Aroido's shared inquiry form for product questions, lab discussions, and collaboration requests, with direct builder inboxes as fallback.",
      layout_seo_title: "LayoutRecall | Restore Scrambled macOS Monitor Layouts",
      layout_meta_description:
        "LayoutRecall is the macOS menu bar app for restoring saved monitor layouts after sleep, wake, or dock reconnect sends them back wrong.",
      hello_alert: "Aroido readiness check is complete.",
      nav_blog: "Blog",
      theme_auto: "Auto",
      theme_light: "Light",
      theme_dark: "Dark",
      blog_eyebrow: "Journal",
      blog_listing_title: "Writing from the build loop.",
      blog_listing_description:
        "Product notes, release thinking, and operating decisions from Aroido.",
      blog_archive_label: "Archive",
      blog_read_more: "Read article",
      blog_pagination_prev: "Previous",
      blog_pagination_next: "Next",
      blog_footer_title: "Need product context before you read deeper?",
      blog_footer_description:
        "Start with the current public product page, then come back here for the reasoning and release notes behind the work.",
      blog_footer_primary: "See VibeSmith",
      blog_footer_secondary: "Contact Aroido",
      blog_recent_label: "Recent posts",
      blog_post_label: "Blog post",
      blog_back_to_blog: "Back to blog",
      blog_article_nav_prev: "Previous article",
      blog_article_nav_next: "Next article",
      blog_posts_empty: "No posts published yet.",
    },
    ko: {
      page_title: "Aroido | 일, 데스크톱, 놀이를 가로지르는 AI-네이티브 소프트웨어",
      meta_description:
        "Aroido는 개발 워크플로우, 데스크톱 유틸리티, 실험적 놀이를 가로질러 집중도 높은 소프트웨어를 만드는 AI-네이티브 프로덕트 스튜디오입니다. 현재 공개 제품은 VibeSmith와 LayoutRecall입니다.",
      home_seo_title: "Aroido | 일, 데스크톱, 놀이를 가로지르는 AI-네이티브 소프트웨어",
      home_meta_description:
        "Aroido는 개발 워크플로우, 데스크톱 유틸리티, 실험적 놀이를 가로질러 집중도 높은 소프트웨어를 만드는 AI-네이티브 프로덕트 스튜디오입니다. 현재 공개 제품은 VibeSmith와 LayoutRecall입니다.",
      projects_seo_title: "Aroido 제품 | 공개 소프트웨어와 움직이는 Labs",
      projects_meta_description:
        "Aroido의 공개 제품과 Labs를 둘러보세요. 현재 공개 제품은 AI 코딩 레포 드리프트용 VibeSmith와 macOS 모니터 데스크 복구용 LayoutRecall입니다.",
      vibe_seo_title: "VibeSmith | AI 코딩 레포 드리프트를 번지기 전에 진단",
      vibe_meta_description:
        "VibeSmith는 멀티 레포 AI 팀이 Cursor·Claude Code 워크플로우에서 활성 컴포넌트, 숨은 종속성, 컨텍스트 낭비, 세팅 드리프트를 진단하도록 돕습니다.",
      team_seo_title: "Aroido 팀 | 믿음, 빌더, 제품 방향",
      team_meta_description:
        "Aroido 팀을 소개합니다. 왜 이런 방식으로 만드는지, 무엇을 믿는지, 여러 카테고리의 제품을 어떻게 출하하는지 확인할 수 있습니다.",
      contact_seo_title: "Aroido 문의 | 제품, Labs, 협업",
      contact_meta_description:
        "제품 질문, Labs 논의, 협업 요청은 Aroido 공용 폼으로 받고, 필요할 때만 빌더 개인 메일을 fallback으로 사용합니다.",
      layout_seo_title: "LayoutRecall | 흐트러진 macOS 모니터 레이아웃 복구",
      layout_meta_description:
        "LayoutRecall은 슬립, 웨이크, 도크 재연결 뒤에 잘못 돌아온 저장된 모니터 레이아웃을 복구하는 macOS 메뉴바 앱입니다.",
      hello_alert: "Aroido 준비 상태 점검이 완료되었습니다.",
      nav_blog: "블로그",
      theme_auto: "시스템",
      theme_light: "라이트",
      theme_dark: "다크",
      blog_eyebrow: "저널",
      blog_listing_title: "빌드 루프에서 남기는 글.",
      blog_listing_description: "Aroido의 제품 메모, 릴리즈 판단, 운영 결정을 정리합니다.",
      blog_archive_label: "아카이브",
      blog_read_more: "글 읽기",
      blog_pagination_prev: "이전",
      blog_pagination_next: "다음",
      blog_footer_title: "더 읽기 전에 제품 맥락이 필요하신가요?",
      blog_footer_description:
        "현재 공개 제품 페이지부터 확인한 뒤, 다시 돌아와 작업 배경과 릴리즈 판단을 읽을 수 있습니다.",
      blog_footer_primary: "VibeSmith 보기",
      blog_footer_secondary: "Aroido 문의",
      blog_recent_label: "최근 글",
      blog_post_label: "블로그 글",
      blog_back_to_blog: "블로그로 돌아가기",
      blog_article_nav_prev: "이전 글",
      blog_article_nav_next: "다음 글",
      blog_posts_empty: "아직 공개된 글이 없습니다.",
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
    communityReleaseStatusNode: document.querySelector("[data-community-release-status]"),
    localizedMediaNodes: Array.from(
      document.querySelectorAll("[data-media-src-en], [data-media-src-en-light]")
    ),
    copyCommandButtons: Array.from(document.querySelectorAll("[data-copy-target]")),
    tallyPopupNodes: Array.from(document.querySelectorAll("[data-tally-popup]")),
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
    communityReleaseMeta: null,
  };
  const copyFeedbackTimers = new WeakMap();

  function shouldLoadVercelAnalytics() {
    return window.location.protocol === "https:";
  }

  function shouldIgnoreAnalyticsEvent(event) {
    if (!event || typeof event.url !== "string") {
      return false;
    }

    try {
      const url = new URL(event.url, window.location.origin);
      return url.pathname.startsWith("/debug/") || url.searchParams.has(DEBUG_LANGUAGE_QUERY_KEY);
    } catch (_error) {
      return (
        event.url.includes("/debug/") || event.url.includes(`${DEBUG_LANGUAGE_QUERY_KEY}=`)
      );
    }
  }

  function initializeVercelAnalytics() {
    if (!shouldLoadVercelAnalytics()) {
      return;
    }

    if (
      window.__aroidoVercelAnalyticsInitialized ||
      document.querySelector(`script[src="${VERCEL_ANALYTICS_SCRIPT_PATH}"]`)
    ) {
      return;
    }

    window.__aroidoVercelAnalyticsInitialized = true;

    // Load Vercel Analytics only on deployed HTTPS pages.
    window.va =
      typeof window.va === "function"
        ? window.va
        : function analyticsStub() {
            (window.vaq = window.vaq || []).push(arguments);
          };

    // Keep internal debug traffic out of public analytics.
    window.va("beforeSend", (event) => {
      if (shouldIgnoreAnalyticsEvent(event)) {
        return null;
      }

      return event;
    });

    const analyticsScript = document.createElement("script");
    analyticsScript.defer = true;
    analyticsScript.src = VERCEL_ANALYTICS_SCRIPT_PATH;
    document.head.appendChild(analyticsScript);
  }

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

  function clearCopyFeedbackTimer(button) {
    const existingTimer = copyFeedbackTimers.get(button);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      copyFeedbackTimers.delete(button);
    }
  }

  function getCopyButtonDefaultKey(button) {
    const configuredKey =
      button.getAttribute("data-copy-default-key") || button.getAttribute("data-i18n");
    return isNonEmptyString(configuredKey) ? configuredKey : "copy_command";
  }

  function setCopyButtonLabel(button, key, copyState = null) {
    const translationKey = isNonEmptyString(key) ? key : getCopyButtonDefaultKey(button);
    button.setAttribute("data-i18n", translationKey);

    if (copyState) {
      button.setAttribute("data-copy-state", copyState);
    } else {
      button.removeAttribute("data-copy-state");
    }

    const translatedLabel =
      getTranslation(getCurrentLanguage(), translationKey) ||
      getTranslation(DEFAULT_LANGUAGE, translationKey);
    if (isNonEmptyString(translatedLabel)) {
      button.textContent = translatedLabel;
    }
  }

  function scheduleCopyButtonReset(button) {
    clearCopyFeedbackTimer(button);
    const timer = window.setTimeout(() => {
      setCopyButtonLabel(button, getCopyButtonDefaultKey(button));
      copyFeedbackTimers.delete(button);
    }, COPY_FEEDBACK_DURATION_MS);
    copyFeedbackTimers.set(button, timer);
  }

  function getCopyTargetText(targetId) {
    if (!isNonEmptyString(targetId)) {
      return "";
    }

    const targetNode = document.getElementById(targetId);
    if (!targetNode) {
      return "";
    }

    const rawText = targetNode.textContent;
    return isNonEmptyString(rawText) ? rawText.trim() : "";
  }

  function copyTextWithExecCommand(text) {
    if (!isNonEmptyString(text)) {
      return false;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-9999px";
    helper.style.left = "-9999px";
    helper.style.opacity = "0";

    document.body.appendChild(helper);
    helper.focus();
    helper.select();

    let isCopied = false;
    try {
      isCopied = document.execCommand("copy");
    } catch (_error) {
      isCopied = false;
    }

    document.body.removeChild(helper);
    return isCopied;
  }

  async function copyTextToClipboard(text) {
    if (!isNonEmptyString(text)) {
      return false;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_error) {
        /* Fallback to execCommand for non-secure contexts or denied permissions */
      }
    }

    return copyTextWithExecCommand(text);
  }

  function initializeCopyCommandButtons() {
    if (!Array.isArray(dom.copyCommandButtons) || dom.copyCommandButtons.length === 0) {
      return;
    }

    dom.copyCommandButtons.forEach((button) => {
      const defaultKey = getCopyButtonDefaultKey(button);
      button.setAttribute("data-copy-default-key", defaultKey);
      button.setAttribute("aria-live", "polite");

      button.addEventListener("click", async () => {
        const targetId = button.getAttribute("data-copy-target") || "";
        const content = getCopyTargetText(targetId);
        const wasCopied = await copyTextToClipboard(content);

        if (wasCopied) {
          setCopyButtonLabel(button, "copy_copied", "success");
        } else {
          setCopyButtonLabel(button, "copy_failed", "error");
        }

        trackEvent("copy_command_result", {
          status: wasCopied ? "success" : "error",
          target_id: targetId,
        });
        scheduleCopyButtonReset(button);
      });
    });
  }

  function initializeTallyPopupButtons() {
    if (!Array.isArray(dom.tallyPopupNodes) || dom.tallyPopupNodes.length === 0) {
      return;
    }

    dom.tallyPopupNodes.forEach((node) => {
      node.addEventListener("click", (event) => {
        if (!window.Tally || typeof window.Tally.openPopup !== "function") {
          return;
        }

        event.preventDefault();

        const intent = node.getAttribute("data-tally-popup") || "general";
        const source =
          node.getAttribute("data-tally-source") ||
          node.getAttribute("data-track-label") ||
          "unknown";

        window.Tally.openPopup(TALLY_POPUP_FORM_ID, {
          layout: "modal",
          width: 700,
          overlay: true,
          hiddenFields: {
            intent,
            source,
            pagePath: window.location.pathname,
            pageUrl: window.location.href,
            language: getCurrentLanguage(),
          },
          onSubmit: () => {
            trackEvent("contact_form_submit", { intent, source });
          },
        });
      });
    });
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
      if (isDebugLanguageEnabled()) {
        url.searchParams.set("lang", language);
      } else {
        url.searchParams.delete("lang");
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
      const tagName = isNonEmptyString(parsed.tagName) ? parsed.tagName : null;
      const prerelease =
        typeof parsed.prerelease === "boolean" ? parsed.prerelease : null;
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

      return { releaseUrl, packageUrl, tagName, prerelease };
    } catch (_error) {
      return null;
    }
  }

  function setCachedCommunityLinks(releaseUrl, packageUrl, tagName, prerelease) {
    try {
      if (!isNonEmptyString(releaseUrl) || !isNonEmptyString(packageUrl)) {
        return;
      }

      localStorage.setItem(
        COMMUNITY_LINK_CACHE_KEY,
        JSON.stringify({
          releaseUrl,
          packageUrl,
          tagName: isNonEmptyString(tagName) ? tagName : null,
          prerelease: typeof prerelease === "boolean" ? prerelease : null,
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

  function setCommunityReleaseMeta(meta) {
    if (!meta || !isNonEmptyString(meta.tagName)) {
      state.communityReleaseMeta = null;
      return;
    }

    state.communityReleaseMeta = {
      tagName: meta.tagName,
      prerelease: meta.prerelease === true,
    };
  }

  function getCommunityReleaseMeta() {
    return state.communityReleaseMeta;
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
    if (document.documentElement.getAttribute("data-static-meta") === "true") {
      return;
    }

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

  function formatCommunityReleaseStatus(language, meta) {
    if (!meta || !isNonEmptyString(meta.tagName)) {
      return (
        getTranslation(language, "vibe_download_release_status_fallback") ||
        "Latest public build: GitHub release channel, including prereleases."
      );
    }

    const template = getTranslation(
      language,
      meta.prerelease
        ? "vibe_download_release_status_prerelease"
        : "vibe_download_release_status_release"
    );

    if (isNonEmptyString(template)) {
      return template.replace("{tag}", meta.tagName);
    }

    return meta.prerelease
      ? `Latest public build: ${meta.tagName} prerelease.`
      : `Latest public build: ${meta.tagName}.`;
  }

  function updateCommunityReleaseStatus(meta = getCommunityReleaseMeta()) {
    if (!dom.communityReleaseStatusNode) {
      return;
    }

    dom.communityReleaseStatusNode.textContent = formatCommunityReleaseStatus(
      getCurrentLanguage(),
      meta
    );
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

  function normalizeReleaseUrl(url) {
    if (!isNonEmptyString(url)) {
      return null;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return null;
  }

  function getLatestRelease(payload) {
    if (Array.isArray(payload)) {
      return payload.find((release) => isPlainObject(release) && release.draft !== true) || null;
    }

    return isPlainObject(payload) ? payload : null;
  }

  function getLatestPackageUrl(release) {
    const assets = release?.assets;
    if (!Array.isArray(assets) || assets.length === 0) {
      return null;
    }

    const candidates = assets
      .map((asset) => {
        const name = String(asset?.name || "");
        const url = normalizeReleaseUrl(asset?.browser_download_url);
        return {
          name,
          url,
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
    const release = getLatestRelease(payload);
    if (!release) {
      return null;
    }

    const releaseUrl = normalizeReleaseUrl(release?.html_url) || COMMUNITY_RELEASE_PERMALINK;
    const packageUrl = getLatestPackageUrl(release) || releaseUrl;
    const tagName = isNonEmptyString(release?.tag_name) ? release.tag_name : null;
    const prerelease = release?.prerelease === true;

    applyCommunityLinks(releaseUrl, packageUrl);
    setCommunityReleaseMeta({ tagName, prerelease });
    updateCommunityReleaseStatus();
    return { releaseUrl, packageUrl, tagName, prerelease };
  }

  async function fetchLatestCommunityReleasePayload() {
    try {
      const response = await fetch(COMMUNITY_RELEASE_API_URL, { cache: "no-store" });
      if (!response.ok) {
        return null;
      }
      const payload = await response.json();
      return Array.isArray(payload) || isPlainObject(payload) ? payload : null;
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
      setCommunityReleaseMeta({
        tagName: cached.tagName,
        prerelease: cached.prerelease === true,
      });
      updateCommunityReleaseStatus();
      return;
    }

    const payload = await fetchLatestCommunityReleasePayload();
    if (payload) {
      const latestLinks = applyLatestCommunityReleaseLinks(payload);
      if (latestLinks) {
        setCachedCommunityLinks(
          latestLinks.releaseUrl,
          latestLinks.packageUrl,
          latestLinks.tagName,
          latestLinks.prerelease
        );
      }
    }
  }

  function applyLocalizedMedia(language) {
    if (!Array.isArray(dom.localizedMediaNodes) || dom.localizedMediaNodes.length === 0) {
      return;
    }

    const nextLanguage = normalizeLanguage(language);
    const resolvedTheme =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

    dom.localizedMediaNodes.forEach((node) => {
      const nextSrc =
        node.getAttribute(`data-media-src-${nextLanguage}-${resolvedTheme}`) ||
        node.getAttribute(`data-media-src-${nextLanguage}`) ||
        node.getAttribute(`data-media-src-${DEFAULT_LANGUAGE}-${resolvedTheme}`) ||
        node.getAttribute(`data-media-src-${DEFAULT_LANGUAGE}`) ||
        "";
      if (nextSrc && node.getAttribute("src") !== nextSrc) {
        node.setAttribute("src", nextSrc);
      }
    });
  }

  function applyLanguage(language, options = {}) {
    const { syncQuery = true } = options;
    const requestedLanguage = normalizeLanguage(language);
    // Public runtime stays en-only. ko remains available for internal debug review.
    const nextLanguage = isDebugLanguageEnabled() ? requestedLanguage : DEFAULT_LANGUAGE;

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
    const preferred = isDebugLanguageEnabled()
      ? getQueryLanguage() || getDebugLanguage() || getStoredLanguage() || DEFAULT_LANGUAGE
      : DEFAULT_LANGUAGE;
    applyLanguage(preferred);
  }

  function initializeLanguageSwitch() {
    const isVisible = isDebugLanguageEnabled();
    updateLanguageSwitchVisibility(isVisible);

    if (!isVisible) {
      return;
    }

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
    applyLocalizedMedia(getCurrentLanguage());

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

    if (typeof window.va === "function") {
      window.va("event", { name, data: payload });
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

  function buildVideoEmbedUrl(videoId, startSeconds) {
    if (!isNonEmptyString(videoId)) {
      return "";
    }

    const params = new URLSearchParams({
      autoplay: "1",
      playsinline: "1",
      rel: "0",
    });

    const parsedStartSeconds = Number.parseInt(startSeconds, 10);
    if (Number.isFinite(parsedStartSeconds) && parsedStartSeconds > 0) {
      params.set("start", String(parsedStartSeconds));
    }

    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  }

  function createVideoEmbedFrame(container, trigger) {
    const videoId = container.getAttribute("data-video-id");
    const videoUrl = buildVideoEmbedUrl(videoId, container.getAttribute("data-video-start"));
    if (!isNonEmptyString(videoUrl)) {
      return null;
    }

    const iframe = document.createElement("iframe");
    iframe.className = "video-embed-frame";
    iframe.src = videoUrl;
    iframe.title = trigger.getAttribute("aria-label") || "Embedded video";
    iframe.loading = "eager";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("allowfullscreen", "");
    return iframe;
  }

  function initializeVideoEmbeds() {
    const containers = Array.from(document.querySelectorAll("[data-video-embed]"));
    if (containers.length === 0) {
      return;
    }

    containers.forEach((container) => {
      const trigger = container.querySelector("[data-video-trigger]");
      if (!(trigger instanceof HTMLButtonElement)) {
        return;
      }

      trigger.addEventListener(
        "click",
        () => {
          const iframe = createVideoEmbedFrame(container, trigger);
          if (!iframe) {
            return;
          }

          container.classList.add("is-active");
          trigger.replaceWith(iframe);
        },
        { once: true }
      );
    });
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
    updateCommunityReleaseStatus();
  }

  function runSynchronousBootstrap() {
    initializeVercelAnalytics();
    initializeDebugLanguageMode();
    initializeCommunityReleaseLinks();
    initializeThemeSwitch();
    initializeTrackedEvents();
    initializeVideoEmbeds();
    initializeCopyCommandButtons();
    initializeTallyPopupButtons();
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
