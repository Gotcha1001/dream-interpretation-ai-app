"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

/**
 * Nudges new users to fill in their background before interpreting a dream.
 * Not a hard block: readings still work without it, they're just more generic.
 */
export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { hasProfile, isLoading } = useProfile();
  if (isLoading) return null;
  if (hasProfile) return <>{children}</>;

  return (
    <div className="space-y-6">
      <Card className="border-violet-500/40 bg-violet-500/5">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 text-violet-500" />
            <div>
              <p className="font-semibold">Tell us about your life first</p>
              <p className="text-sm text-muted-foreground">
                Dreams are personal. Sharing your background gives you a reading
                that fits you, not a generic one.
              </p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button>Add my background</Button>
          </Link>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
