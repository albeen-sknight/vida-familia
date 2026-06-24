import type { Locale } from "@vida-familia/shared";
import { Link, useLocation } from "react-router-dom";
import { localizedPath } from "../lib/locale";

const labels: Record<Locale, string> = { fa: "FA", en: "EN", es: "ES" };

export function LanguageSwitcher({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const { pathname } = useLocation();

  return (
    <nav className={`language-switcher ${compact ? "language-compact" : ""}`} aria-label="Language selector" dir="ltr">
      {(Object.keys(labels) as Locale[]).map((item) => (
        <Link
          key={item}
          className={item === locale ? "active" : ""}
          to={localizedPath(item, pathname)}
          onClick={() => window.localStorage.setItem("vida-familia-locale", item)}
          lang={item}
          hrefLang={item}
        >
          {labels[item]}
        </Link>
      ))}
    </nav>
  );
}
