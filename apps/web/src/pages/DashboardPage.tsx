import { useEffect, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { apiBaseUrl } from "../lib/api";

type StatsResponse = {
  ok: true;
  stats: Record<string, unknown>;
};

type LeadRow = {
  id: string;
  created_at: string;
  reference_code?: string;
  full_name: string;
  email: string;
  target_country: string;
  desired_path: string;
  priority?: string;
  status: string;
};

const copy = {
  fa: { title: "داشبورد داخلی", intro: "ابزار داخلی Vida Familia. نیازمند توکن ادمین است.", token: "توکن ادمین", load: "دریافت آمار", leads: "لیدها", stats: "آمار" },
  en: { title: "Internal dashboard", intro: "Internal Vida Familia tool. Requires the admin token.", token: "Admin token", load: "Load stats", leads: "Leads", stats: "Stats" },
  es: { title: "Dashboard interno", intro: "Herramienta interna de Vida Familia. Requiere token de admin.", token: "Token admin", load: "Cargar", leads: "Leads", stats: "Estadísticas" },
} as const;

async function authedGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export function DashboardPage({ locale, view = "stats" }: { locale: Locale; view?: "stats" | "leads" }) {
  const c = copy[locale];
  const [token, setToken] = useState(() => window.sessionStorage.getItem("vida-familia-admin-token") || "");
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    setError("");
    window.sessionStorage.setItem("vida-familia-admin-token", token);
    try {
      const statsResponse = await authedGet<StatsResponse>("/api/admin/stats", token);
      setStats(statsResponse.stats);
      if (view === "leads") {
        const leadResponse = await authedGet<{ ok: true; leads: LeadRow[] }>("/api/admin/leads?limit=25", token);
        setLeads(leadResponse.leads);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dashboard request failed.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { if (token) void load(); }, []);

  return (
    <section className="dashboard-page">
      <div className="container dashboard-shell">
        <div className="dashboard-hero"><p className="eyebrow">ADMIN</p><h1>{c.title}</h1><p>{c.intro}</p></div>
        <form className="dashboard-token" onSubmit={(event) => { event.preventDefault(); void load(); }}>
          <label className="form-field"><span>{c.token}</span><input value={token} onChange={(event) => setToken(event.target.value)} type="password" autoComplete="off" /></label>
          <button className="button button-gold" disabled={busy || !token} type="submit">{c.load}</button>
        </form>
        {error ? <div className="form-message error">{error}</div> : null}
        {stats ? <div className="dashboard-stats">{Object.entries(stats).filter(([, value]) => typeof value !== "object").map(([key, value]) => <article key={key}><span>{key.replaceAll("_", " ")}</span><strong>{String(value)}</strong></article>)}</div> : null}
        {view === "leads" ? <div className="dashboard-table"><h2>{c.leads}</h2><table><thead><tr><th>Reference</th><th>Name</th><th>Email</th><th>Country</th><th>Path</th><th>Priority</th><th>Status</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td>{lead.reference_code || lead.id.slice(0, 8)}</td><td>{lead.full_name}</td><td>{lead.email}</td><td>{lead.target_country}</td><td>{lead.desired_path}</td><td>{lead.priority}</td><td>{lead.status}</td></tr>)}</tbody></table></div> : null}
      </div>
    </section>
  );
}
