import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar email={user.email ?? ""} />
      <main className="flex-1 min-w-0 px-5 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
