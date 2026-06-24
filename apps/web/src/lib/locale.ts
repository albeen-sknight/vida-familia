import { defaultLocale, isLocale, type Locale } from "@vida-familia/shared";

export function localeFromPath(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) return firstSegment;

  if (pathname === "/" || pathname === "") return defaultLocale;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("vida-familia-locale") ?? undefined;
    if (isLocale(stored)) return stored;
  }

  return defaultLocale;
}

export function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  return `/${segments.join("/")}`;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const barePath = pathWithoutLocale(pathname);
  return barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
}

export function routeFor(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function textDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}
