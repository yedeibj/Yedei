import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: page } = await supabase
    .from("legal_pages")
    .select("title, content")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!page) notFound();

  const rawParagraphs: string[] = (page.content ?? "").split(/\n\s*\n/);
  const paragraphs: string[] = rawParagraphs.filter((p: string) => p.trim().length > 0);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
        <h1 className="font-display text-3xl italic text-[#181715]">{page.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#8C8579]">
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)
          ) : (
            <p>Contenu à venir.</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
