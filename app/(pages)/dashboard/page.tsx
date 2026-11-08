"use client";

import Link from "next/link";
import { Moon, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useDreams } from "@/hooks/useDreams";
import { useDreamStats } from "@/hooks/useDreamStats";
import { DreamCard } from "@/components/dreams/DreamCard";
import { ProfileGate } from "@/components/dreams/ProfileGate";
import { useUserContext } from "@/app/context/UserContext";

export default function DashboardPage() {
  const user = useUserContext();
  const { dreams, isLoading } = useDreams();
  const { total, analysed, topSymbols, topEmotions } = useDreamStats();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Good to see you{user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            What did your mind show you last night?
          </p>
        </div>
        <Link href="/dashboard/dreams/new">
          <Button className="bg-violet-600 text-white hover:bg-violet-500">
            <Moon className="mr-2 h-4 w-4" /> Record a dream
          </Button>
        </Link>
      </div>

      <ProfileGate>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-muted-foreground">
                Dreams recorded
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{total}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-muted-foreground">
                Interpreted
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{analysed}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-muted-foreground">
                Common feelings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {topEmotions.length ? (
                topEmotions.map(([e, c]) => (
                  <Badge key={e} variant="secondary">
                    {e} · {c}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Not enough data yet
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {topSymbols.length > 0 && (
          <Card className="border-violet-500/30 bg-violet-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Symbols that keep returning
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {topSymbols.map(([s, c]) => (
                <Badge key={s} className="bg-violet-600 capitalize text-white">
                  {s} × {c}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent dreams</h2>
            <Link
              href="/dashboard/dreams"
              className="text-sm text-violet-500 hover:underline"
            >
              View journal
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : dreams && dreams.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {dreams.slice(0, 4).map((d) => (
                <DreamCard key={d._id} dream={d} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <NotebookPen className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Your dream journal is empty.
                </p>
                <Link href="/dashboard/dreams/new">
                  <Button variant="outline">Record your first dream</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </ProfileGate>
    </div>
  );
}
