"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/lib/types";
import { Plus, Trash2, Mail, Building2, X } from "lucide-react";

export default function ClientesClient({ initialClients }: { initialClients: Client[] }) {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("clients")
      .insert({
        user_id: user!.id,
        name: form.name,
        email: form.email || null,
        company: form.company || null,
        notes: form.notes || null,
      })
      .select()
      .single();

    setSaving(false);
    if (!error && data) {
      setClients([data, ...clients]);
      setForm({ name: "", email: "", company: "", notes: "" });
      setShowForm(false);
    }
  }

  async function handleDelete(id: string) {
    setClients(clients.filter((c) => c.id !== id));
    await supabase.from("clients").delete().eq("id", id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Clientes</h1>
          <p className="text-ink-300">{clients.length} cliente{clients.length !== 1 && "s"} guardado{clients.length !== 1 && "s"}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-glow-sm hover:shadow-glow transition-shadow"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancelar" : "Nuevo cliente"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4 mb-8 border border-line rounded-2xl p-6 bg-panel/60 backdrop-blur">
          <input required placeholder="Nombre *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500" />
          <input placeholder="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500" />
          <input placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="bg-void/60 border border-line rounded-xl px-4 py-2.5 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500" />
          <button disabled={saving} className="sm:col-span-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar cliente"}
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="border border-line rounded-2xl p-5 bg-panel/60 backdrop-blur group relative">
              <button
                onClick={() => handleDelete(c.id)}
                className="absolute top-4 right-4 text-ink-500 hover:text-mag opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={15} />
              </button>
              <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center font-display text-violet-300 mb-4">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-medium mb-2">{c.name}</h3>
              {c.company && (
                <p className="text-xs text-ink-500 flex items-center gap-1.5 mb-1">
                  <Building2 size={12} /> {c.company}
                </p>
              )}
              {c.email && (
                <p className="text-xs text-ink-500 flex items-center gap-1.5">
                  <Mail size={12} /> {c.email}
                </p>
              )}
              {c.notes && <p className="text-xs text-ink-300 mt-3 border-t border-line pt-3">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-line rounded-2xl p-14 text-center text-ink-500">
      Todavía no tienes clientes guardados. Añade el primero para empezar a generar presupuestos.
    </div>
  );
}
