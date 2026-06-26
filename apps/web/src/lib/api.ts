const PRODUCTION_API_BASE_URL = "https://vida-familia-api.natsu-dragneel13576.workers.dev";
const DEV_API_BASE_URL = "http://localhost:8787";

function cleanBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

export function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return cleanBaseUrl(configured);
  if (import.meta.env.DEV) return DEV_API_BASE_URL;
  return PRODUCTION_API_BASE_URL;
}

export const apiBaseUrl = resolveApiBaseUrl();

if (import.meta.env.DEV) {
  console.info("[Vida Familia] API base URL:", apiBaseUrl);
}

export async function apiPost<T>(path: string, payload: unknown, timeoutMs = 15_000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "Request failed";
      throw new Error(message);
    }
    return data as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function publicWhatsAppLink(message: string): string | null {
  const raw = import.meta.env.VITE_PUBLIC_WHATSAPP_NUMBER as string | undefined;
  const number = raw?.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
