import type { Locale } from "@vida-familia/shared";
import { apiBaseUrl } from "./api";

export type AnalyticsEventName =
  | "page_view"
  | "language_switch"
  | "apply_start"
  | "apply_submit"
  | "contact_submit"
  | "quiz_start"
  | "quiz_complete"
  | "guide_unlock"
  | "cta_click";

function sessionId(): string {
  const key = "vida-familia-session-id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

export function trackEvent(eventName: AnalyticsEventName, metadata: Record<string, unknown> = {}, locale?: Locale): void {
  const payload = {
    event_name: eventName,
    path: window.location.pathname,
    locale,
    referrer: document.referrer || undefined,
    session_id: sessionId(),
    source: new URLSearchParams(window.location.search).get("utm_source") || undefined,
    campaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
    metadata: { ...metadata, device_class: window.innerWidth < 720 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop" },
  };
  fetch(`${apiBaseUrl}/api/analytics/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
