"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calculator, FileDown, Pencil, Check, Loader2 } from "lucide-react";

const SERVICE_TYPES = [
  { id: "diseno", label: "Diseño / Branding", base: 35 },
  { id: "dev", label: "Desarrollo web / app", base: 45 },
  { id: "marketing", label: "Marketing / Contenido", base: 30 },
  { id: "consultoria", label: "Consultoría", base: 55 },
  { id: "video", label: "Vídeo / Producción", base: 40 },
];

const EXPERIENCE = [
  { id: "junior", label: "0–2 años", mult: 0.85 },
  { id: "mid", label: "2–5 años", mult: 1.0 },
  { id: "senior", label: "5–10 años", mult: 1.35 },
  { id: "expert", label: "10+ años", mult: 1.7 },
];

const URGENCY = [
  { id: "normal", label: "Plazo normal", mult: 1.0 },
  { id: "rapido", label: "Entrega rápida", mult: 1.2 },
  { id: "urgente", label: "Urgente (<48h)", mult: 1.45 },
];

const COMPLEXITY = [
  { id: "simple", label: "Simple", mult: 0.9 },
  { id: "estandar", label: "Estándar", mult: 1.0 },
  { id: "compleja", label: "Compleja", mult: 1.3 },
];

// Extras basados en el feedback real de freelancers: integraciones, código
// ajeno, colaboración con terceros y costes externos (hosting/IA) también
// afectan al precio y rara vez se reflejan en calculadoras simples.
const EXTRAS = [
  { id: "integraciones", label: "Integraciones externas (APIs, pagos...)", flat: 150 },
  { id: "codigo_ajeno", label: "Proyecto ya iniciado / código ajeno", flat: 120 },
  { id: "colaboracion", label: "Colaboración con otro profesional", flat: 100 },
  { id: "costes_externos", label: "Costes externos (hosting, IA, licencias)", flat: 80 },
];

type ClientLite = { id: string; name: string };

function euro(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function CalculatorClient({ clients }: { clients: ClientLite[] }) {
  const supabase = createClient();

  const [service, setService] = useState(SERVICE_TYPES[1]);
  const [hours, setHours] = useState(20);
  const [experience, setExperience] = useState(EXPERIENCE[1]);
  const [urgency, setUrgency] = useState(URGENCY[0]);
  const [complexity, setComplexity] = useState(COMPLEXITY[1]);
  const [extras, setExtras] = useState<string[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const breakdown = useMemo(() => {
    const finalRate = service.base * experience.mult * complexity.mult * urgency.mult;
    const laborTotal = finalRate * hours;
    const extrasTotal = extras.reduce((acc, id) => acc + (EXTRAS.find((e) => e.id === id)?.flat ?? 0), 0);
    const subtotal = laborTotal + extrasTotal;
    return { finalRate, laborTotal, extrasTotal, subtotal };
  }, [service, hours, experience, complexity, urgency, extras]);

  const total = manualOverride ?? breakdown.subtotal;

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSave() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const resolvedClientName = clientId
      ? clients.find((c) => c.id === clientId)?.name ?? clientName
      : clientName;

    await supabase.from("sales").insert({
      user_id: user!.id,
      client_id: clientId || null,
      client_name: resolvedClientName || "Cliente sin nombre",
      project_name: projectName || "Proyecto sin nombre",
      service_type: service.label,
      hours,
      base_rate: service.base,
      final_rate: breakdown.finalRate,
      total,
      status: "borrador",
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-violet-400 mb-3">
          <Calculator size={13} /> Calculadora de precio
        </div>
        <h1 className="font-display text-3xl mb-1">Un precio, con motivos</h1>
        <p className="text-ink-300">Ajusta las variables y guarda el presupuesto en tu historial.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Inputs */}
        <div className="space-y-7">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Cliente</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-void/60 border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="">Nuevo / sin guardar</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {!clientId && (
                <input
                  placeholder="Nombre del cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full mt-2 bg-void/60 border border-line rounded-xl px-3 py-2 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500"
                />
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Proyecto</label>
              <input
                placeholder="Nombre del proyecto"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-void/60 border border-line rounded-xl px-3 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-ink-500 mb-3 block">Tipo de servicio</label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_TYPES.map((s) => (
                <OptionButton key={s.id} active={service.id === s.id} onClick={() => setService(s)}>
                  {s.label}
                </OptionButton>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-widest text-ink-500">Horas estimadas</label>
              <span className="text-sm font-mono text-violet-300">{hours}h</span>
            </div>
            <input type="range" min="1" max="200" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-ink-500 mb-3 block">Experiencia</label>
            <div className="grid grid-cols-4 gap-2">
              {EXPERIENCE.map((e) => (
                <OptionButton key={e.id} active={experience.id === e.id} onClick={() => setExperience(e)} small>
                  {e.label}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-ink-500 mb-3 block">Complejidad</label>
              <div className="space-y-2">
                {COMPLEXITY.map((c) => (
                  <OptionButton key={c.id} active={complexity.id === c.id} onClick={() => setComplexity(c)} full>
                    {c.label}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-ink-500 mb-3 block">Plazo</label>
              <div className="space-y-2">
                {URGENCY.map((u) => (
                  <OptionButton key={u.id} active={urgency.id === u.id} onClick={() => setUrgency(u)} full>
                    {u.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-ink-500 mb-3 block">
              Extras que afectan al precio
            </label>
            <div className="space-y-2">
              {EXTRAS.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                    extras.includes(extra.id)
                      ? "bg-violet-600/15 border-violet-500/40 text-ink-100"
                      : "border-line text-ink-300 hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${extras.includes(extra.id) ? "bg-violet-500 border-violet-500" : "border-ink-700"}`}>
                      {extras.includes(extra.id) && <Check size={11} className="text-white" />}
                    </span>
                    {extra.label}
                  </span>
                  <span className="font-mono text-xs text-ink-500">+{extra.flat}€</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live document */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-[#0A0712] border border-violet-500/20 rounded-2xl p-8 relative overflow-hidden shadow-glow">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="flex items-start justify-between mb-8 relative">
              <div>
                <div className="text-xs text-ink-500 uppercase tracking-widest mb-1">Presupuesto</div>
                <div className="font-display text-lg">{projectName || "Nombre del proyecto"}</div>
              </div>
              <div className="text-right text-xs text-ink-500">
                {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-line">
              <div className="text-xs text-ink-500 uppercase tracking-widest mb-1">Para</div>
              <div className="font-medium">{clientId ? clients.find((c) => c.id === clientId)?.name : clientName || "Tu cliente"}</div>
              <div className="text-sm text-ink-500 mt-1">{service.label}</div>
            </div>

            <div className="space-y-2.5 mb-6 text-sm font-mono">
              <Row label={`Tarifa (${service.label})`} value={`${euro(service.base)}/h`} />
              <Row label={`Experiencia (${experience.label})`} value={`×${experience.mult}`} />
              <Row label={`Complejidad (${complexity.label})`} value={`×${complexity.mult}`} />
              {urgency.mult !== 1 && <Row label={`Plazo (${urgency.label})`} value={`×${urgency.mult}`} accent />}
              <Row label="Tarifa final" value={`${euro(breakdown.finalRate)}/h`} />
              <Row label="Horas" value={`${hours}h`} />
              <Row label="Mano de obra" value={euro(breakdown.laborTotal)} />
              {breakdown.extrasTotal > 0 && <Row label="Extras" value={euro(breakdown.extrasTotal)} accent />}
            </div>

            <div className="flex items-end justify-between pt-4 border-t-2 border-violet-500/30">
              <span className="text-xs uppercase tracking-widest text-ink-500 flex items-center gap-1">
                Total <Pencil size={10} className="text-ink-700" />
              </span>
              <input
                type="number"
                value={Math.round(total)}
                onChange={(e) => setManualOverride(Number(e.target.value))}
                className="font-display text-4xl bg-transparent text-right w-48 focus:outline-none focus:text-violet-300"
              />
            </div>
            {manualOverride !== null && (
              <button onClick={() => setManualOverride(null)} className="text-xs text-violet-400 mt-1 float-right hover:text-violet-200">
                restablecer precio calculado
              </button>
            )}

            <div className="flex gap-3 mt-8 clear-both">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-violet-600 to-mag text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow transition-shadow disabled:opacity-60"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <FileDown size={15} />}
                {saved ? "Guardado" : saving ? "Guardando..." : "Guardar en historial"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={accent ? "text-violet-300" : ""}>{value}</span>
    </div>
  );
}

function OptionButton({
  children,
  active,
  onClick,
  small,
  full,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  small?: boolean;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${full ? "w-full text-left" : ""} ${small ? "px-2 py-2 text-xs" : "px-3 py-2.5 text-sm"} rounded-xl border transition-colors ${
        active
          ? "bg-violet-600/15 border-violet-500/40 text-ink-100"
          : "border-line text-ink-300 hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}
