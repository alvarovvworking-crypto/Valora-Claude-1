"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types";
import { Check, Loader2 } from "lucide-react";

export default function AjustesClient({
  initialSettings,
  email,
}: {
  initialSettings: Settings | null;
  email: string;
}) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(initialSettings?.full_name ?? "");
  const [businessName, setBusinessName] = useState(initialSettings?.business_name ?? "");
  const [currency, setCurrency] = useState(initialSettings?.currency ?? "EUR");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("settings").upsert({
      user_id: user!.id,
      full_name: fullName,
      business_name: businessName,
      currency,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl mb-1">Ajustes</h1>
      <p className="text-ink-300 mb-8">Personaliza tu perfil y tus presupuestos.</p>

      <form onSubmit={handleSave} className="space-y-5 border border-line rounded-2xl p-6 bg-panel/60 backdrop-blur">
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Email</label>
          <input disabled value={email} className="w-full bg-void/30 border border-line rounded-xl px-4 py-2.5 text-sm text-ink-500" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Nombre completo</label>
          <input
            value={fullName ?? ""}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Nombre del negocio</label>
          <input
            value={businessName ?? ""}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Aparece en tus presupuestos"
            className="w-full bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-500 mb-2 block">Moneda</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="MXN">MXN ($)</option>
          </select>
        </div>
        <button
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-glow-sm hover:shadow-glow transition-shadow disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {saved ? "Guardado" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
