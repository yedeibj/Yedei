"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@yedei/database";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-[#8C8579] underline-offset-4 hover:text-[#181715] hover:underline"
    >
      Se déconnecter
    </button>
  );
}
