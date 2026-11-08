"use client";

import { useMemo } from "react";
import { useDreams } from "./useDreams";

/** Recurring symbols + emotions across the journal, computed client-side. */
export function useDreamStats() {
  const { dreams, isLoading } = useDreams();

  const stats = useMemo(() => {
    const symbols = new Map<string, number>();
    const emotions = new Map<string, number>();
    for (const d of dreams ?? []) {
      for (const s of d.symbols) {
        const k = s.toLowerCase();
        symbols.set(k, (symbols.get(k) ?? 0) + 1);
      }
      for (const e of d.emotions) emotions.set(e, (emotions.get(e) ?? 0) + 1);
    }
    const top = (m: Map<string, number>, n: number) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

    return {
      total: dreams?.length ?? 0,
      analysed: dreams?.filter((d) => d.status === "ready").length ?? 0,
      topSymbols: top(symbols, 6).filter(([, c]) => c > 1),
      topEmotions: top(emotions, 5),
    };
  }, [dreams]);

  return { ...stats, isLoading };
}
