import { createClient as createServerSupabaseClient } from "@yedei/database/server";

export default async function PromoBar() {
  const supabase = await createServerSupabaseClient();
  const { data: messages } = await supabase
    .from("promo_messages")
    .select("id, text")
    .eq("is_active", true)
    .order("sort_order");

  if (!messages || messages.length === 0) return null;

  const loopMessages = [...messages, ...messages];

  return (
    <div className="w-full overflow-hidden bg-[#181715] text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2">
        {loopMessages.map((msg, i) => (
          <span
            key={`${msg.id}-${i}`}
            className="mx-6 flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em]"
          >
            {msg.text}
            <span className="flex gap-[3px]" aria-hidden="true">
              <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
              <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
              <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
