"use client";

import { motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import { useColorTheme } from "@/app/context/ColorThemeContext";
import { buildHudGridBackground } from "@/convex/lib/colorThemes";

const CORNERS = [
  "-left-px -top-px border-l-2 border-t-2",
  "-right-px -top-px border-r-2 border-t-2",
  "-left-px -bottom-px border-l-2 border-b-2",
  "-right-px -bottom-px border-r-2 border-b-2",
];

/**
 * The "generating modal" look as a reusable card, theme-aware:
 *  - dark:  #04070a panel + radial glow + accent grid + corner brackets
 *  - light: pure white panel, accent-colored border / corners / glow
 * Nothing is hardcoded to one accent; everything reads from useColorTheme().
 */
export function ThemedPanel({
  children,
  className = "",
  scanline = false,
}: {
  children: ReactNode;
  className?: string;
  scanline?: boolean;
}) {
  const { theme } = useColorTheme();
  const { hex400, shades } = theme;
  const gridBg = useMemo(() => buildHudGridBackground(theme), [theme]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white dark:bg-[#04070a] ${className}`}
      style={{
        borderColor: `${shades[500]}59`,
        boxShadow: `0 0 40px -18px ${hex400}59`,
      }}
    >
      {/* grid + radial glow: dark mode only, so light pages stay pure white */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-30 dark:block"
        style={{
          backgroundImage: `url("${gridBg}")`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,_#0a1219_0%,_#04070a_75%)] dark:block" />
      {CORNERS.map((cls) => (
        <div
          key={cls}
          className={`pointer-events-none absolute ${cls} h-5 w-5`}
          style={{ borderColor: `${shades[500]}99` }}
        />
      ))}
      {scanline && (
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${shades[400]}99, transparent)`,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function ThemedLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-300/70">
      {children}
    </p>
  );
}
