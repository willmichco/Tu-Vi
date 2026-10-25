/** Tách tiêu đề thành từng chữ để hiện lần lượt khi tải trang (CSS .split .w). */
export function SplitText({ text, start = 0, className = "" }: { text: string; start?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={`w ${className}`} style={{ "--i": start + i } as React.CSSProperties}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
