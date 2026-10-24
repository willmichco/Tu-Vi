import type { Brightness, Element } from "@/lib/tuvi/constants";

export const ELEMENT_COLOR: Record<Element, string> = {
  kim: "#ebe8e2",
  moc: "#86dcab",
  thuy: "#86c9f6",
  hoa: "#ff9584",
  tho: "#e7c07a",
};

export const BRIGHTNESS_OPACITY: Record<Brightness, number> = {
  M: 1,
  V: 0.95,
  D: 0.82,
  B: 0.62,
  H: 0.42,
};

export const BRIGHTNESS_SHORT: Record<Brightness, string> = {
  M: "M",
  V: "V",
  D: "Đ",
  B: "B",
  H: "H",
};

export const HOA_COLOR: Record<string, string> = {
  "Lộc": "#86dcab",
  "Quyền": "#e7c07a",
  "Khoa": "#86c9f6",
  "Kỵ": "#ff9584",
};

/** Tọa độ ô của mỗi chi trên lưới 4×4 truyền thống: [hàng, cột]. */
export const GRID_POS: Record<number, [number, number]> = {
  5: [0, 0],
  6: [0, 1],
  7: [0, 2],
  8: [0, 3],
  4: [1, 0],
  9: [1, 3],
  3: [2, 0],
  10: [2, 3],
  2: [3, 0],
  1: [3, 1],
  0: [3, 2],
  11: [3, 3],
};
