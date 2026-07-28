export const SITE_URL = "https://aroido.com";
export const DEFAULT_LOCALE = "en";

export const PUBLIC_LOCALES = [
  {
    code: "en",
    label: "EN",
    prefix: "",
    pathSegment: "",
    htmlLang: "en-US",
    ogLocale: "en_US",
    jsonLdLanguage: "en-US",
    hreflang: "en",
    mediaKey: "en",
  },
  {
    code: "ko",
    label: "KO",
    prefix: "/ko",
    pathSegment: "ko",
    htmlLang: "ko-KR",
    ogLocale: "ko_KR",
    jsonLdLanguage: "ko-KR",
    hreflang: "ko",
    mediaKey: "ko",
  },
  {
    code: "ja",
    label: "JA",
    prefix: "/ja",
    pathSegment: "ja",
    htmlLang: "ja-JP",
    ogLocale: "ja_JP",
    jsonLdLanguage: "ja-JP",
    hreflang: "ja",
    mediaKey: "ja",
  },
  {
    code: "zh-Hans",
    label: "中文",
    prefix: "/zh-hans",
    pathSegment: "zh-hans",
    htmlLang: "zh-Hans",
    ogLocale: "zh_CN",
    jsonLdLanguage: "zh-Hans",
    hreflang: "zh-Hans",
    mediaKey: "zh-hans",
  },
];

export const LOCALE_BY_CODE = new Map(PUBLIC_LOCALES.map((locale) => [locale.code, locale]));
export const LOCALE_BY_PATH_SEGMENT = new Map(
  PUBLIC_LOCALES.filter((locale) => locale.pathSegment).map((locale) => [
    locale.pathSegment,
    locale,
  ])
);

export const STATIC_I18N_ROUTES = [
  { sourcePath: "index.html", routePath: "/" },
  { sourcePath: "projects/index.html", routePath: "/projects/" },
  { sourcePath: "projects/vibesmith/index.html", routePath: "/projects/vibesmith/" },
  { sourcePath: "projects/layoutrecall/index.html", routePath: "/projects/layoutrecall/" },
  { sourcePath: "projects/tokenmon/index.html", routePath: "/projects/tokenmon/" },
  { sourcePath: "mongle/privacy/index.html", routePath: "/mongle/privacy/" },
  { sourcePath: "mongle/support/index.html", routePath: "/mongle/support/" },
  { sourcePath: "team/index.html", routePath: "/team/" },
  { sourcePath: "contact/index.html", routePath: "/contact/" },
];

export function getLocale(code) {
  return LOCALE_BY_CODE.get(code) || LOCALE_BY_CODE.get(DEFAULT_LOCALE);
}

export function normalizeRoutePath(pathname) {
  const rawPath = typeof pathname === "string" && pathname ? pathname : "/";
  const [pathPart, suffix = ""] = rawPath.split(/([?#].*)/, 2);
  let normalized = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;

  if (!normalized.endsWith("/") && !/\.[A-Za-z0-9]+$/.test(normalized)) {
    normalized = `${normalized}/`;
  }

  return `${normalized}${suffix}`;
}

export function stripLocalePrefix(pathname) {
  const normalized = normalizeRoutePath(pathname);
  const [pathPart, suffix = ""] = normalized.split(/([?#].*)/, 2);
  const segments = pathPart.split("/").filter(Boolean);

  if (segments.length > 0 && LOCALE_BY_PATH_SEGMENT.has(segments[0].toLowerCase())) {
    const stripped = `/${segments.slice(1).join("/")}`;
    const nextPath = normalizeRoutePath(stripped === "/" ? "/" : stripped);
    return `${nextPath}${suffix}`;
  }

  return normalized;
}

export function localizePath(pathname, localeCode) {
  const locale = getLocale(localeCode);
  const basePath = stripLocalePrefix(pathname);

  if (locale.code === DEFAULT_LOCALE) {
    return basePath;
  }

  return basePath === "/" ? `${locale.prefix}/` : `${locale.prefix}${basePath}`;
}

export function localizeUrl(pathname, localeCode) {
  return `${SITE_URL}${localizePath(pathname, localeCode)}`;
}

export function buildHreflangLinks(routePath) {
  const links = PUBLIC_LOCALES.map((locale) => ({
    hreflang: locale.hreflang,
    href: localizeUrl(routePath, locale.code),
  }));

  links.push({
    hreflang: "x-default",
    href: localizeUrl(routePath, DEFAULT_LOCALE),
  });

  return links;
}

export function shouldLocalizeHref(href) {
  if (typeof href !== "string" || !href.startsWith("/")) {
    return false;
  }

  if (href.startsWith("//")) {
    return false;
  }

  const [pathPart] = href.split(/[?#]/, 1);
  const firstSegment = pathPart.split("/").filter(Boolean)[0] || "";
  const rootSafePrefixes = new Set(["assets", "_vercel", "i18n"]);

  if (rootSafePrefixes.has(firstSegment)) {
    return false;
  }

  return !/\.[A-Za-z0-9]+$/.test(pathPart);
}

export function localizeHref(href, localeCode) {
  if (!shouldLocalizeHref(href)) {
    return href;
  }

  const match = href.match(/^([^?#]*)([^#]*)(#.*)?$/);
  if (!match) {
    return href;
  }

  const [, pathPart, query = "", hash = ""] = match;
  return `${localizePath(pathPart || "/", localeCode)}${query}${hash}`;
}
