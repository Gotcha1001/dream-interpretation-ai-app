"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/** Background profile. `profile === undefined` while loading, `null` if none yet. */
export function useProfile() {
  const profile = useQuery(api.profile.get);
  const save = useMutation(api.profile.upsert);
  return {
    profile,
    isLoading: profile === undefined,
    hasProfile: !!profile,
    save,
  };
}
