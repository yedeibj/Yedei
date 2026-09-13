import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["company_phone", "company_address"]);

  const phone = settings?.find((s) => s.key === "company_phone")?.value;
  const address = settings?.find((s) => s.key === "company_address")?.value;
  const telHref = phone ? "tel:" + phone.replace(/\s+/g, "") : "";

  return (
    <main>
      <Header />
      <div className="grid grid-cols-1 gap-12 px-6 py-16 sm:px-12 lg:grid-cols-2">
        <div>
          <span className="flex gap-[3px]" aria-hidden="true">
            <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
            <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
            <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
          </span>
          <h1 className="mt-3 font-display text-3xl italic text-[#181715] sm:text-4xl">
            Contactez-nous
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8C8579]">
            Une question sur une commande, une collection, ou simplement envie de nous dire
            bonjour ? Écris-nous, on te répond rapidement.
          </p>

          <div className="mt-10 space-y-6">
            {phone && (
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8C8579]">Téléphone</p>
                <a href={telHref} className="mt-1 block font-display text-xl italic text-[#181715] hover:text-[#006400]">
                  {phone}
                </a>
              </div>
            )}
            {address && (
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8C8579]">Adresse</p>
                <p className="mt-1 text-sm text-[#181715]">{address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8D3C9] bg-[#F6F3EC] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}
