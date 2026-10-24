import { MAJOR_STARS, PALACE_NAMES, PALACE_TOPIC } from "@/lib/tuvi/constants";
import { STAR_AT_MENH } from "./kb";

export const dictStars = MAJOR_STARS.map((s) => ({ ...s, desc: STAR_AT_MENH[s.name].split(". ")[0] + "." }));
export const dictPalaces = PALACE_NAMES.map((p) => ({ name: p, desc: PALACE_TOPIC[p] }));
