import type { Locale } from "@vida-familia/shared";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <div className="app-shell"><Header locale={locale} /><main id="main-content">{children}</main><Footer locale={locale} /></div>;
}
