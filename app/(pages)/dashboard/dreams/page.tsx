"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDreams } from "@/hooks/useDreams";
import { DreamCard } from "@/components/dreams/DreamCard";

export default function JournalPage() {
  const { dreams, isLoading } = useDreams();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return dreams ?? [];
    return (dreams ?? []).filter((d) =>
      [d.title, d.summary ?? "", ...d.symbols, ...d.emotions]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [dreams, q]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Dream journal</h1>
        <Link href="/dashboard/dreams/new">
          <Button className="bg-violet-600 text-white hover:bg-violet-500">
            <Moon className="mr-2 h-4 w-4" /> New dream
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by symbol, feeling or title…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {q ? "No dreams match your search." : "No dreams recorded yet."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DreamCard key={d._id} dream={d} />
          ))}
        </div>
      )}
    </div>
  );
}
