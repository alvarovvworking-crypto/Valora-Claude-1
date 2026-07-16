"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Sale } from "@/lib/types";

const STATUS_STYLES: Record<Sale["status"], string> = {
  borrador: "bg-ink-700/30 text-ink-300 border-ink-700",
  enviado: "bg-cyan/10 text-cyan border-cyan/30",
  aceptado: "bg-violet-600/15 text-violet-300 border-violet-500/30",
  rechazado: "bg-mag/10 text-mag border-mag/30",
  cobrado: "bg-green-500/10 text-green-400 border-green-500/30",
};

const STATUS_LABELS: Record<Sale["status"], string> = {
  borrador: "Borrador",
  enviado: "Enviado",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
  cobrado: "Cobrado",
};

function euro(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function HistorialClient({ initialSales }: { initialSales: Sale[] }) {
  const supabase = createClient();
  const [sales, setSales] = useState<Sale[]>(initialSales);

  async function updateStatus(id: string, status: Sale["status"]) {
    setSales(sales.map((s) => (s.id === id ? { ...s, status } : s)));
    await supabase.from("sales").update({ status }).eq("id", id);
  }

  const totalCobrado = sales.filter((s) => s.status === "cobrado").reduce((a, s) => a + Number(s.total), 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Historial de ventas</h1>
          <p className="text-ink-300">{sales.length} presupuesto{sales.length !== 1 && "s"} · {euro(totalCobrado)} cobrado</p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="border border-dashed border-line rounded-2xl p-14 text-center text-ink-500">
          Todavía no has guardado ningún presupuesto. Ve a la calculadora para crear el primero.
        </div>
      ) : (
        <div className="border border-line rounded-2xl overflow-hidden bg-panel/40 backdrop-blur">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-ink-500 text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-3 font-normal">Proyecto</th>
                <th className="text-left px-5 py-3 font-normal">Cliente</th>
                <th className="text-left px-5 py-3 font-normal">Fecha</th>
                <th className="text-right px-5 py-3 font-normal">Total</th>
                <th className="text-right px-5 py-3 font-normal">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="font-medium">{s.project_name}</div>
                    <div className="text-xs text-ink-500">{s.service_type} · {s.hours}h</div>
                  </td>
                  <td className="px-5 py-4 text-ink-300">{s.client_name}</td>
                  <td className="px-5 py-4 text-ink-500 text-xs font-mono">
                    {new Date(s.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-5 py-4 text-right font-mono">{euro(Number(s.total))}</td>
                  <td className="px-5 py-4 text-right">
                    <select
                      value={s.status}
                      onChange={(e) => updateStatus(s.id, e.target.value as Sale["status"])}
                      className={`text-xs rounded-full px-3 py-1.5 border ${STATUS_STYLES[s.status]} bg-transparent focus:outline-none`}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value} className="bg-void text-ink-100">
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
