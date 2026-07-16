import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Calculator, TrendingUp, ArrowUpRight } from "lucide-react";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: sales } = await supabase
    .from("sales")
    .select("total, status")
    .eq("user_id", user!.id);

  const totalFacturado = (sales ?? [])
    .filter((s) => s.status === "cobrado")
    .reduce((acc, s) => acc + Number(s.total), 0);

  const pendiente = (sales ?? [])
    .filter((s) => s.status === "enviado" || s.status === "aceptado")
    .reduce((acc, s) => acc + Number(s.total), 0);

  const name = user?.user_metadata?.full_name?.split(" ")[0] ?? "";

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">
        {name ? `Hola, ${name}` : "Hola"} 👋
      </h1>
      <p className="text-ink-300 mb-8">Esto es lo que está pasando en tu negocio.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={<Users size={18} />} label="Clientes guardados" value={clientCount ?? 0} />
        <StatCard icon={<TrendingUp size={18} />} label="Cobrado" value={`${totalFacturado.toLocaleString("es-ES")} €`} accent />
        <StatCard icon={<ArrowUpRight size={18} />} label="Pendiente de cobro" value={`${pendiente.toLocaleString("es-ES")} €`} />
      </div>

      <Link
        href="/dashboard/calculadora"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow transition-shadow"
      >
        <Calculator size={16} /> Crear nuevo presupuesto
      </Link>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-line p-5 bg-panel/60 backdrop-blur ${accent ? "shadow-glow-sm" : ""}`}>
      <div className="flex items-center gap-2 text-ink-500 text-xs uppercase tracking-widest mb-3">
        {icon} {label}
      </div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}
