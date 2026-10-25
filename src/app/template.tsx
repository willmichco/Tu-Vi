"use client";

import { useEffect, useState } from "react";

let firstMount = true;

/**
 * Chuyển trang phía client: nội dung mới mờ dần vào (chỉ opacity — không phá position: fixed).
 * Lần tải đầu không chạy để không làm chậm LCP.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => !firstMount);
  useEffect(() => {
    firstMount = false;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
