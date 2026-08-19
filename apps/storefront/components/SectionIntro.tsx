export default function SectionIntro({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="px-6 pt-12 text-center sm:px-12">
      <span className="mx-auto flex w-fit justify-center gap-[3px]" aria-hidden="true">
        <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
        <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
        <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
      </span>
      <h2 className="mt-3 font-display text-2xl italic text-[#181715] sm:text-3xl">{title}</h2>
      {description && <p className="mt-1 text-sm text-[#8C8579]">{description}</p>}
    </div>
  );
}
