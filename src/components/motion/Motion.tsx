"use client";

import { useEffect } from "react";

/**
 * Một bộ điều phối chuyển động cho toàn site (không thư viện):
 * - [data-reveal]: hiện dần khi cuộn tới. Cha có [data-stagger] thì con hiện so le.
 * - .card / .spotlight: viền và quầng sáng đi theo con trỏ (biến --mx, --my).
 * Theo dõi cả phần tử thêm sau (đổi trang, đổi tab) bằng MutationObserver.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const seen = new WeakSet<Element>();

    const pending = new Set<Element>();
    const show = (el: Element) => {
      pending.delete(el);
      el.classList.add("is-in");
      // Hiện xong thì trả lại transition gốc của phần tử (hover, focus…)
      const done = () => el.classList.add("reveal-done");
      el.addEventListener("transitionend", (e) => (e as TransitionEvent).propertyName === "opacity" && done(), { once: true });
      setTimeout(done, 2200);
    };
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!e.isIntersecting) continue;
                show(e.target);
                io?.unobserve(e.target);
              }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
          )
        : null;

    const scan = (scope: ParentNode) => {
      const targets: Element[] = [];
      scope.querySelectorAll<HTMLElement>("[data-stagger]").forEach((parent) => {
        Array.from(parent.children).forEach((child, i) => {
          if (child instanceof HTMLElement) child.style.setProperty("--i", String(i));
          targets.push(child);
        });
      });
      scope.querySelectorAll("[data-reveal]").forEach((el) => targets.push(el));
      targets.forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        pending.add(el);
        if (io) io.observe(el);
        else show(el);
      });
    };

    // Cuộn nhanh (hoặc khung hình chậm) có thể lướt qua phần tử mà observer không kịp thấy:
    // mọi phần tử đã nằm trên đáy màn hình đều phải hiện, để cuộn ngược lên không gặp chỗ trống.
    let scrollFrame = 0;
    const sweep = () => {
      scrollFrame = 0;
      const limit = window.innerHeight * 0.92;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          io?.unobserve(el);
          show(el);
        }
      });
    };
    const onScroll = () => {
      if (!scrollFrame && pending.size) scrollFrame = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && scan(n.parentElement ?? n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Spotlight: chỉ cập nhật thẻ đang nằm dưới con trỏ, gộp theo khung hình
    let frame = 0;
    let last: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!last || !(last.target instanceof Element)) return;
        const el = last.target.closest<HTMLElement>(".card, .spotlight");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${last.clientX - r.left}px`);
        el.style.setProperty("--my", `${last.clientY - r.top}px`);
      });
    };
    if (window.matchMedia("(hover: hover)").matches) window.addEventListener("pointermove", onMove, { passive: true });

    root.classList.add("motion-ready");
    return () => {
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return null;
}
