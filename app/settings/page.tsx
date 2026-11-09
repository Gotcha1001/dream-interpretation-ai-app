"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useColorTheme } from "@/app/context/ColorThemeContext";
import { COLOR_THEME_LIST, ColorThemeId } from "@/convex/lib/colorThemes";

/** Append an alpha channel (0–1) to a #rrggbb hex color, e.g. alpha("#22d3ee", 0.4) -> "#22d3ee66" */
function alpha(hex: string, a: number) {
  const v = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${v}`;
}

export default function SettingsPage() {
  const { theme, themeId, setThemeId, isSaving } = useColorTheme();
  const { hex400 } = theme;
  const [hoveredId, setHoveredId] = useState<ColorThemeId | null>(null);

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h1
            className="text-2xl font-black tracking-tight text-slate-900 dark:text-stone-50"
            style={{ filter: `drop-shadow(0 0 16px ${alpha(hex400, 0.35)})` }}
          >
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-stone-400">
            Personalize how your dream journal looks.
          </p>
        </div>

        <div
          className="rounded-xl border bg-white p-6 dark:bg-[#04070a]"
          style={{
            borderColor: alpha(hex400, 0.15),
            boxShadow: `0 0 24px -10px ${alpha(hex400, 0.3)}`,
          }}
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400">
              Accent color
            </p>
            {isSaving && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving
              </span>
            )}
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-stone-400">
            Pick the accent used across the sidebar, borders, rain and cards.
          </p>
          <div
            role="radiogroup"
            aria-label="Accent color"
            className="grid grid-cols-3 gap-3 sm:grid-cols-6"
          >
            {COLOR_THEME_LIST.map((swatchTheme) => {
              const isSelected = themeId === swatchTheme.id;
              const isHovered = hoveredId === swatchTheme.id;
              const glowHex = swatchTheme.hex400;

              return (
                <button
                  key={swatchTheme.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setThemeId(swatchTheme.id)}
                  onMouseEnter={() => setHoveredId(swatchTheme.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200"
                  style={{
                    borderColor: isSelected
                      ? alpha(glowHex, 0.4)
                      : isHovered
                        ? alpha(glowHex, 0.25)
                        : "transparent",
                    backgroundColor: isSelected
                      ? alpha(glowHex, 0.08)
                      : isHovered
                        ? alpha(glowHex, 0.05)
                        : undefined,
                    boxShadow: isSelected
                      ? `0 0 20px -4px ${alpha(glowHex, 0.5)}`
                      : isHovered
                        ? `0 0 16px -6px ${alpha(glowHex, 0.4)}`
                        : undefined,
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-shadow duration-200"
                    style={{
                      backgroundColor: swatchTheme.swatchHex,
                      boxShadow:
                        isSelected || isHovered
                          ? `0 0 0 1px ${alpha(glowHex, 0.6)} inset, 0 0 14px 2px ${alpha(
                              glowHex,
                              isSelected ? 0.65 : 0.45,
                            )}`
                          : "inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {isSelected && (
                      <Check
                        className="h-4 w-4 text-black/70"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span
                    className={
                      isSelected || isHovered
                        ? ""
                        : "text-slate-600 dark:text-stone-300"
                    }
                    style={{
                      color: isSelected || isHovered ? glowHex : undefined,
                    }}
                  >
                    <span className="text-[11px] font-medium">
                      {swatchTheme.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-xl border bg-white p-6 dark:bg-[#04070a]"
          style={{
            borderColor: alpha(hex400, 0.15),
            boxShadow: `0 0 24px -10px ${alpha(hex400, 0.3)}`,
          }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400">
            Appearance
          </p>
          <p className="mb-4 text-sm text-slate-500 dark:text-stone-400">
            Switch between light and dark mode.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
