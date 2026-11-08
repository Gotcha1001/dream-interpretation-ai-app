"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/** Journal list (lightweight rows). */
export function useDreams() {
  const dreams = useQuery(api.dreams.list);
  return { dreams, isLoading: dreams === undefined };
}

/** One dream. Reactive: flips from "analyzing" to "ready" without polling. */
export function useDream(id: string) {
  const dream = useQuery(api.dreams.get, { id });
  return { dream, isLoading: dream === undefined, notFound: dream === null };
}

export function useDreamActions() {
  return {
    createDream: useMutation(api.dreams.create),
    retryDream: useMutation(api.dreams.retry),
    removeDream: useMutation(api.dreams.remove),
  };
}

export type DreamId = Id<"dreams">;
