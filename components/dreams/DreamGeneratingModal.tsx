// components/dreams/DreamGeneratingModal.tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Moon,
  Eye,
  Brain,
  Link2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/* Palette: the English app reads this from ColorThemeContext. The     */
/* dream app has a single violet identity, so it lives here instead.   */
/* ------------------------------------------------------------------ */

interface Shades {
  300: string;
  500: string;
  600: string;
  700: string;
}

const HEX_400 = "#a78bfa";
const SHADES: Shades = {
  300: "#c4b5fd",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
};

/** Same faint HUD grid as the English app, drawn with CSS gradients. */
const GRID_BG = `linear-gradient(${HEX_400}1f 1px, transparent 1px), linear-gradient(90deg, ${HEX_400}1f 1px, transparent 1px)`;

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

interface Step {
  icon: LucideIcon;
  label: string;
}

const DREAM_STEPS: readonly Step[] = [
  { icon: Eye, label: "Reading your dream" },
  { icon: Brain, label: "Spotting symbols & themes" },
  { icon: Link2, label: "Connecting it to your life" },
  { icon: Sparkles, label: "Writing your interpretation" },
];

export type GeneratingVariant = "dream";

interface VariantCopy {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  steps: readonly Step[];
}

const COPY: Record<GeneratingVariant, VariantCopy> = {
  dream: {
    title: "Interpreting your dream",
    subtitle: "Reading it against your own life",
    icon: Moon,
    steps: DREAM_STEPS,
  },
};

/* ------------------------------------------------------------------ */
/* Decorative data                                                     */
/* ------------------------------------------------------------------ */

const PULSES: readonly { top: string; left: string; delay: number }[] = [
  { top: "12%", left: "10%", delay: 0 },
  { top: "22%", left: "86%", delay: 0.8 },
  { top: "70%", left: "8%", delay: 1.5 },
  { top: "80%", left: "88%", delay: 0.5 },
  { top: "48%", left: "92%", delay: 1.9 },
  { top: "58%", left: "6%", delay: 1.1 },
];

/** Falling "readouts": dream-flavoured instead of A2 / noun / 12 wds. */
const READOUTS: readonly (readonly string[])[] = [
  ["REM", "water", "falling"],
  ["theme", "flight", "3 syms"],
  ["mood", "dread", "recur."],
  ["lucid", "house", "chase"],
  ["REM", "mirror", "2 ppl"],
];

const RAIN_COLUMNS = Array.from({ length: 6 }).map((_, i) => ({
  left: `${(i / 5) * 100}%`,
  tokens: READOUTS[i % READOUTS.length],
  duration: 8 + (i % 4) * 1.8,
  delay: (i % 5) * 0.6,
}));

const flicker = {
  opacity: [0.55, 0.9, 0.5, 1, 0.6, 0.85, 0.55],
  scale: [0.95, 1.05, 0.92, 1.1, 0.97, 1.04, 0.95],
};

const CORNERS: readonly string[] = [
  "-left-px -top-px border-l-2 border-t-2",
  "-right-px -top-px border-r-2 border-t-2",
  "-left-px -bottom-px border-l-2 border-b-2",
  "-right-px -bottom-px border-r-2 border-b-2",
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface DreamGeneratingModalProps {
  open: boolean;
  variant?: GeneratingVariant;
  /**
   * Optional escape hatch. When provided, a "Keep reading in the background"
   * button appears and Esc / outside-click dismiss the modal. Leave it off
   * (like the English app) for a fully locked modal, e.g. on the form while
   * the dream is being saved.
   */
  onClose?: () => void;
}

export function DreamGeneratingModal({
  open,
  variant = "dream",
  onClose,
}: DreamGeneratingModalProps) {
  const { title, subtitle, icon: CoreIcon, steps } = COPY[variant];
  const reduceMotion = useReducedMotion();
  const dismissable = typeof onClose === "function";

  const spin = (reverse = false) =>
    reduceMotion ? undefined : { rotate: reverse ? -360 : 360 };
  const spinTransition = (duration: number) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, repeat: Infinity, ease: "linear" as const };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && onClose) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-0 bg-transparent p-0 shadow-none"
        onPointerDownOutside={(e) => {
          if (!dismissable) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!dismissable) e.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{subtitle}</DialogDescription>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative overflow-hidden rounded-xl border bg-[#07050f] p-8 text-center"
            style={{
              borderColor: `${HEX_400}40`,
              boxShadow: `0 0 60px -12px ${HEX_400}80`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ backgroundImage: GRID_BG, backgroundSize: "48px 48px" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#140d24_0%,_#07050f_75%)]" />

            {/* falling dream-stat readouts */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
              {RAIN_COLUMNS.map((col, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 flex flex-col gap-5 font-mono text-[10px]"
                  style={{
                    left: col.left,
                    color:
                      i % 2 === 0 ? `${HEX_400}59` : "rgba(244,114,182,0.25)",
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 25%, black 65%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, black 25%, black 65%, transparent)",
                  }}
                  animate={reduceMotion ? undefined : { y: ["-30%", "130%"] }}
                  transition={{
                    duration: col.duration,
                    repeat: Infinity,
                    delay: col.delay,
                    ease: "linear",
                  }}
                >
                  {col.tokens.map((t, j) => (
                    <span key={j}>{t}</span>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* idea-spark dust */}
            {PULSES.map((s, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
                style={{
                  top: s.top,
                  left: s.left,
                  backgroundColor: SHADES[300],
                }}
                animate={
                  reduceMotion ? undefined : { opacity: [0.1, 0.7, 0.1] }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* corner brackets */}
            {CORNERS.map((cls, i) => (
              <div
                key={i}
                className={`pointer-events-none absolute ${cls} h-5 w-5`}
                style={{ borderColor: `${HEX_400}99` }}
              />
            ))}

            {/* scanline */}
            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${SHADES[300]}80, transparent)`,
              }}
              animate={reduceMotion ? undefined : { top: ["0%", "100%"] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
            />

            {/* flickering core */}
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed"
                style={{ borderColor: `${HEX_400}59` }}
                animate={spin()}
                transition={spinTransition(14)}
              />
              <motion.div
                className="absolute inset-1.5 rounded-full border"
                style={{ borderColor: `${SHADES[600]}66` }}
                animate={spin(true)}
                transition={spinTransition(9)}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: `${SHADES[300]}4d` }}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }
                }
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.div
                className="absolute h-10 w-10 rounded-full blur-xl"
                style={{ backgroundColor: SHADES[300] }}
                animate={reduceMotion ? undefined : flicker}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${HEX_400}80`,
                  background: `linear-gradient(to bottom right, ${SHADES[700]}, ${SHADES[500]})`,
                  boxShadow: `0 0 25px -4px ${HEX_400}e6`,
                }}
              >
                <CoreIcon className="h-5 w-5 text-[#07050f]" />
              </div>
            </div>

            <h2 className="relative text-xl font-bold tracking-tight text-stone-50">
              {title}
            </h2>
            <p className="relative mt-2 font-mono text-xs uppercase tracking-[0.2em] text-stone-400">
              {subtitle}
            </p>

            <div className="relative mt-8 space-y-2.5">
              {steps.map((step, i) => (
                <StepRow key={step.label} step={step} index={i} />
              ))}
            </div>

            <div
              className="relative mt-8 h-1 overflow-hidden rounded-full"
              style={{ backgroundColor: `${HEX_400}1a` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: "35%",
                  background: `linear-gradient(to right, ${SHADES[700]}, ${SHADES[300]}, ${SHADES[700]})`,
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {dismissable && (
              <button
                type="button"
                onClick={onClose}
                className="relative mt-6 text-xs text-stone-400 underline-offset-4 transition hover:text-stone-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Keep reading in the background
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */

function StepRow({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      className="group flex items-center gap-3 rounded-md border px-3 py-2 text-left"
      style={{
        borderColor: `${HEX_400}1a`,
        backgroundColor: `${HEX_400}0a`,
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 * index + 0.2, duration: 0.4 }}
    >
      <motion.div
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded border bg-[#140d24]"
        style={{ borderColor: `${HEX_400}4d` }}
        animate={{
          borderColor: [`${HEX_400}4d`, `${SHADES[300]}b3`, `${HEX_400}4d`],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "easeInOut",
        }}
      >
        <Icon className="h-3 w-3" style={{ color: `${SHADES[300]}cc` }} />
      </motion.div>
      <span className="font-mono text-[13px] text-stone-200/80">
        {step.label}
        <motion.span
          className="inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        >
          …
        </motion.span>
      </span>
      <motion.span
        className="ml-auto h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: HEX_400 }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: index * 0.25,
        }}
      />
    </motion.div>
  );
}
