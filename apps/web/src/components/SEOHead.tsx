import { useEffect } from "react";
import type { Locale } from "@vida-familia/shared";

interface SEOHeadProps {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}

const fallbackSiteUrl = "https://vidafamilia.es";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([key, value]) => node?.setAttribute(key, value));
}

export function SEOHead({ locale, title, description, path = "/", keywords = [], image = "/assets/banner.png" }: SEOHeadProps) {
  useEffect(() => {
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL || fallbackSiteUrl;
    const siteUrl = configuredSiteUrl.replace(/\/$/, "");
    const canonical = `${siteUrl}${path === "/" ? "" : path}`;
    const absoluteImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

    document.title = title;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords.join(", ") });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: absoluteImage });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: locale === "fa" ? "fa_IR" : locale === "es" ? "es_ES" : "en_US" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: absoluteImage });

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [description, image, keywords, locale, path, title]);

  return null;
}
