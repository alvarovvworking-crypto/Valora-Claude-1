import { createClient } from "@/lib/supabase/server";
import HistorialClient from "./HistorialClient";

export default async function HistorialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sales } = await supabase
    .from("sales")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <HistorialClient initialSales={sales ?? []} />;
}
