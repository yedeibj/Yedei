import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function renderInlineBold(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-[#181715]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

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

  const rawBlocks: string[] = (page.content ?? "").split(/\n\s*\n/);
  const blocks: string[] = rawBlocks.filter((b: string) => b.trim().length > 0);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
        <h1 className="font-display text-3xl italic text-[#181715]">{page.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#8C8579]">
          {blocks.length > 0 ? (
            blocks.map((block: string, i: number) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="pt-4 font-display text-xl italic text-[#181715] first:pt-0"
                  >
                    {renderInlineBold(trimmed.slice(3), `h-${i}`)}
                  </h2>
                );
              }
              return <p key={i}>{renderInlineBold(trimmed, `p-${i}`)}</p>;
            })
          ) : (
            <p>Contenu à venir.</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
