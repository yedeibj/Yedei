import { createClient as createServerSupabaseClient } from "@yedei/database/server";

export default async function SectionIntro({ sectionKey }: { sectionKey: string }) {
  const supabase = await createServerSupabaseClient();
  const { data: section } = await supabase
    .from("section_intros")
    .select("title, description, is_active")
    .eq("key", sectionKey)
    .single();

  if (!section || !section.is_active) return null;

  return (
    <div className="px-6 pt-12 text-center sm:px-12">
      <span className="mx-auto flex w-fit justify-center gap-[3px]" aria-hidden="true">
        <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
        <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
        <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
      </span>
      <h2 className="mt-3 font-display text-2xl italic text-[#181715] sm:text-3xl">
        {section.title}
      </h2>
      {section.description && (
        <p className="mt-1 text-sm text-[#8C8579]">{section.description}</p>
      )}
    </div>
  );
}
