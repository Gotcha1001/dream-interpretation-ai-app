import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { analysisValidator } from "./schema";
import { requireUser } from "./helpers";

/** Lightweight rows for the journal + dashboard (no full analysis payload). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(100);

    return dreams.map((d) => ({
      _id: d._id,
      title: d.title ?? d.analysis?.suggestedTitle ?? "Untitled dream",
      dreamDate: d.dreamDate,
      status: d.status,
      emotions: d.emotions,
      recurring: d.recurring,
      lucid: d.lucid,
      summary: d.analysis?.summary,
      symbols: d.analysis?.symbols.map((s) => s.symbol) ?? [],
      createdAt: d.createdAt,
    }));
  },
});

/** Full dream. Returns null if it doesn't exist or isn't yours. */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;

    const dreamId = ctx.db.normalizeId("dreams", id);
    if (!dreamId) return null;
    const dream = await ctx.db.get(dreamId);
    if (!dream || dream.userId !== user._id) return null;
    return dream;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    description: v.string(),
    dreamDate: v.string(),
    emotions: v.array(v.string()),
    recurring: v.boolean(),
    lucid: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const description = args.description.trim();
    if (description.length < 30)
      throw new Error("Please describe your dream in a little more detail.");
    if (description.length > 8000)
      throw new Error("Dream is too long (8000 max).");

    // Cost guard: one analysis in flight per user at a time
    const inFlight = await ctx.db
      .query("dreams")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", user._id).eq("status", "analyzing"),
      )
      .first();
    if (inFlight)
      throw new Error("Hang on, your previous dream is still being analysed.");

    const title = args.title?.trim() || undefined;
    const dreamId = await ctx.db.insert("dreams", {
      userId: user._id,
      title,
      description,
      dreamDate: args.dreamDate,
      emotions: args.emotions.slice(0, 8),
      recurring: args.recurring,
      lucid: args.lucid,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.analysis.analyzeDream, {
      dreamId,
    });
    return dreamId;
  },
});

export const retry = mutation({
  args: { id: v.id("dreams") },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const dream = await ctx.db.get(id);
    if (!dream || dream.userId !== user._id) throw new Error("Not found");
    if (dream.status !== "failed") return;

    await ctx.db.patch(id, { status: "pending", errorMessage: undefined });
    await ctx.scheduler.runAfter(0, internal.analysis.analyzeDream, {
      dreamId: id,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("dreams") },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const dream = await ctx.db.get(id);
    if (!dream || dream.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});

/* ---------- internal: used only by convex/analysis.ts ---------- */

export const getForAnalysis = internalQuery({
  args: { dreamId: v.id("dreams") },
  handler: async (ctx, { dreamId }) => {
    const dream = await ctx.db.get(dreamId);
    if (!dream) return null;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", dream.userId))
      .first();

    // A few recent readings give the AI continuity (recurring symbols/themes)
    const recent = await ctx.db
      .query("dreams")
      .withIndex("by_user", (q) => q.eq("userId", dream.userId))
      .order("desc")
      .take(6);
    const previous = recent
      .filter((d) => d._id !== dreamId && d.analysis)
      .slice(0, 4)
      .map((d) => ({
        date: d.dreamDate,
        summary: d.analysis!.summary,
        symbols: d.analysis!.symbols.map((s) => s.symbol),
      }));

    return { dream, profile, previous };
  },
});

export const markAnalyzing = internalMutation({
  args: { dreamId: v.id("dreams") },
  handler: async (ctx, { dreamId }) => {
    await ctx.db.patch(dreamId, { status: "analyzing" });
  },
});

export const saveAnalysis = internalMutation({
  args: { dreamId: v.id("dreams"), analysis: analysisValidator },
  handler: async (ctx, { dreamId, analysis }) => {
    const dream = await ctx.db.get(dreamId);
    if (!dream) return; // deleted while analysing
    await ctx.db.patch(dreamId, {
      analysis,
      status: "ready",
      errorMessage: undefined,
      title: dream.title ?? analysis.suggestedTitle,
    });
  },
});

export const markFailed = internalMutation({
  args: { dreamId: v.id("dreams"), message: v.string() },
  handler: async (ctx, { dreamId, message }) => {
    const dream = await ctx.db.get(dreamId);
    if (!dream) return;
    await ctx.db.patch(dreamId, { status: "failed", errorMessage: message });
  },
});
