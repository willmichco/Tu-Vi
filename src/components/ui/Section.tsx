export function SectionHead({
  eyebrow,
  title,
  desc,
  align = "left",
  as: Tag = "h2",
}: {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <Tag className="h-display mt-3 text-[32px] leading-[1.15] sm:text-[42px]">{title}</Tag>
      {desc && <p className="mt-4 text-[16.5px] leading-relaxed text-cream-dim">{desc}</p>}
    </div>
  );
}
