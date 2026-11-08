import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./helpers";

const event = v.object({
  title: v.string(),
  whenAgo: v.string(),
  details: v.optional(v.string()),
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const upsert = mutation({
  args: {
    ageRange: v.string(),
    maritalStatus: v.string(),
    relationshipNotes: v.optional(v.string()),
    occupation: v.optional(v.string()),
    familyMembers: v.array(
      v.object({
        relation: v.string(),
        name: v.optional(v.string()),
        notes: v.optional(v.string()),
      }),
    ),
    recentTragedies: v.array(event),
    recentPositives: v.array(event),
    currentStressors: v.optional(v.string()),
    currentHopes: v.optional(v.string()),
    sleepQuality: v.optional(v.string()),
    culturalBackground: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // Cheap guards so one profile can't balloon the AI prompt
    if (args.familyMembers.length > 15)
      throw new Error("Too many family members");
    if (args.recentTragedies.length > 8 || args.recentPositives.length > 8)
      throw new Error("Too many life events");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const doc = { ...args, userId: user._id, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.replace(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("profiles", doc);
  },
});
