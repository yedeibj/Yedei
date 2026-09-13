import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";

async function updateSettings(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();

  const entries: [string, string][] = [
    ["company_phone", String(formData.get("company_phone") ?? "").trim()],
    ["company_address", String(formData.get("company_address") ?? "").trim()],
  ];

  for (const [key, value] of entries) {
    await supabase.from("site_settings").upsert({ key, value });
  }

  revalidatePath("/reglages");
}

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase.from("site_settings").select("key, value");

  const getValue = (key: string, fallback = "") =>
    settings?.find((s) => s.key === key)?.value ?? fallback;

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Réglages</h1>
      <p className="mt-1 text-sm text-[#8C8579]">Paramètres généraux du site.</p>

      <form action={updateSettings} className="mt-8 max-w-sm space-y-6">
        <div className="rounded-md border border-[#D8D3C9] p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">
            Coordonnées (page Contact)
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
                Téléphone
              </label>
              <input
                name="company_phone"
                defaultValue={getValue("company_phone")}
                placeholder="+229 00 00 00 00"
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
                Adresse
              </label>
              <input
                name="company_address"
                defaultValue={getValue("company_address")}
                placeholder="Abomey-Calavi, Bénin"
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
        >
          Enregistrer
        </button>
      </form>
    </AdminShell>
  );
}
