import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Shape of the AI-generated reading. Stored on the dream document so the
 * detail page can render it reactively as soon as the action finishes.
 */
export const analysisValidator = v.object({
  suggestedTitle: v.string(),
  summary: v.string(), // 2-4 sentence plain-language read of the dream
  emotionalTone: v.string(), // e.g. "Anxious but hopeful"
  symbols: v.array(v.object({ symbol: v.string(), meaning: v.string() })),
  emotionalThemes: v.array(v.string()),
  // How the dream ties to what the person told us in their profile
  lifeConnections: v.array(
    v.object({ lifeEvent: v.string(), connection: v.string() }),
  ),
  deepWorries: v.array(v.string()),
  strengthsAndSuccesses: v.array(v.string()),
  // Psychology behind it: one entry per lens (Jungian, Freudian, cognitive...)
  psychology: v.array(v.object({ lens: v.string(), insight: v.string() })),
  reflectionQuestions: v.array(v.string()),
  gentleGuidance: v.string(),
  // Only set when the dream/profile suggests the person may be struggling
  wellbeingNote: v.optional(v.string()),
});

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // One row per user: the "background" form. Fed to the AI with every dream
  // so the reading is personal rather than generic.
  profiles: defineTable({
    userId: v.id("users"),
    ageRange: v.string(), // "25-34"
    maritalStatus: v.string(), // single | in_relationship | married | ...
    relationshipNotes: v.optional(v.string()),
    occupation: v.optional(v.string()),
    familyMembers: v.array(
      v.object({
        relation: v.string(), // "Mother", "Son", ...
        name: v.optional(v.string()),
        notes: v.optional(v.string()), // "we've been distant lately"
      }),
    ),
    recentTragedies: v.array(
      v.object({
        title: v.string(),
        whenAgo: v.string(), // "this month" | "last 3 months" | ...
        details: v.optional(v.string()),
      }),
    ),
    recentPositives: v.array(
      v.object({
        title: v.string(),
        whenAgo: v.string(),
        details: v.optional(v.string()),
      }),
    ),
    currentStressors: v.optional(v.string()),
    currentHopes: v.optional(v.string()),
    sleepQuality: v.optional(v.string()),
    culturalBackground: v.optional(v.string()), // symbol meaning varies by culture/faith
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  dreams: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()), // AI fills this in if the user leaves it blank
    description: v.string(),
    dreamDate: v.string(), // YYYY-MM-DD
    emotions: v.array(v.string()), // what they felt in the dream / on waking
    recurring: v.boolean(),
    lucid: v.boolean(),
    status: v.union(
      v.literal("pending"),
      v.literal("analyzing"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    analysis: v.optional(analysisValidator),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),
});
