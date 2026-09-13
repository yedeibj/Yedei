import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import AdminSidebar from "./AdminSidebar";
import LogoutButton from "./LogoutButton";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div className="flex min-h-screen bg-[#F6F3EC]">
      <AdminSidebar unreadMessages={count ?? 0} />
      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-[#D8D3C9] bg-white px-8 py-4">
          <LogoutButton />
        </header>
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
