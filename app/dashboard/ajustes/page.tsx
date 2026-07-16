import { createClient } from "@/lib/supabase/server";
import AjustesClient from "./AjustesClient";

export default async function AjustesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  return <AjustesClient initialSettings={settings} email={user!.email ?? ""} />;
}
