"use client";

import { motion } from "framer-motion";
import { Moon } from "lucide-react";

const STEPS = [
  "Reading your dream…",
  "Looking at the symbols…",
  "Connecting it to your life…",
  "Weighing worries and strengths…",
  "Writing your reading…",
];

export function AnalyzingState() {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <motion.div
        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
        className="rounded-full bg-violet-500/15 p-6"
      >
        <Moon className="h-12 w-12 text-violet-500" />
      </motion.div>
      <div>
        <h2 className="text-xl font-semibold">Interpreting your dream</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This usually takes 20–40 seconds. You can leave this page, and the
          reading will be saved.
        </p>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {STEPS.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 2.5 }}
          >
            {s}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
