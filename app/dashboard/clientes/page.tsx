import { createClient } from "@/lib/supabase/server";
import ClientesClient from "./ClientesClient";

export default async function ClientesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <ClientesClient initialClients={clients ?? []} />;
}
