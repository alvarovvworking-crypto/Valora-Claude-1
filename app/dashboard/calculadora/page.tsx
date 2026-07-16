import { createClient } from "@/lib/supabase/server";
import CalculatorClient from "./CalculatorClient";

export default async function CalculadoraPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", user!.id)
    .order("name");

  return <CalculatorClient clients={clients ?? []} />;
}
