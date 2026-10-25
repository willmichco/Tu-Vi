/** Nền bầu trời: tinh vân trôi, hai lớp sao nhấp nháy lệch pha, sao băng. */
export function Sky({ shooting = true, className = "" }: { shooting?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="nebula">
        <i />
        <i />
        <i />
      </div>
      <div className="absolute inset-0 starfield animate-twinkle opacity-70" />
      <div className="absolute inset-0 starfield-b animate-twinkle opacity-60 [animation-delay:-2.5s] [animation-duration:7s]" />
      {shooting && (
        <>
          <span className="shooting-star top-[14%] right-[18%]" />
          <span className="shooting-star top-[38%] right-[46%] [animation-delay:6s] [animation-duration:14s]" />
        </>
      )}
    </div>
  );
}
