"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Loader2, Repeat, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";

type Row = NonNullable<(typeof api.dreams.list)["_returnType"]>[number];

export function DreamCard({ dream }: { dream: Row }) {
  const busy = dream.status === "pending" || dream.status === "analyzing";
  return (
    <Link href={`/dashboard/dreams/${dream._id}`}>
      <Card className="h-full accent-glow-hover hover:border-accent-400">
        <CardContent className="space-y-2 pt-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug">{dream.title}</h3>
            <span className="shrink-0 text-xs text-muted-foreground">
              {format(parseISO(dream.dreamDate), "d MMM yyyy")}
            </span>
          </div>

          {busy && (
            <p className="flex items-center gap-1.5 text-xs text-accent-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Interpreting…
            </p>
          )}
          {dream.status === "failed" && (
            <p className="flex items-center gap-1.5 text-xs text-red-500">
              <TriangleAlert className="h-3 w-3" /> Analysis failed. Open to
              retry.
            </p>
          )}
          {dream.summary && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {dream.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {dream.recurring && (
              <Badge variant="secondary" className="gap-1">
                <Repeat className="h-3 w-3" /> Recurring
              </Badge>
            )}
            {dream.symbols.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
