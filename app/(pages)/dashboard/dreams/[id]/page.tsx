"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDream, useDreamActions, type DreamId } from "@/hooks/useDreams";
import { AnalysisView } from "@/components/dreams/AnalysisView";
import { AnalyzingState } from "@/components/dreams/AnalyzingState";
import { DreamGeneratingModal } from "@/components/dreams/DreamGeneratingModal";

export default function DreamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { dream, isLoading, notFound } = useDream(id);
  const { retryDream, removeDream } = useDreamActions();

  // Lets the user tuck the modal away; the inline AnalyzingState takes over.
  // Declared with the other hooks, above the early returns below.
  const [modalHidden, setModalHidden] = useState(false);

  if (isLoading) return <Skeleton className="mx-auto h-96 max-w-3xl" />;

  if (notFound || !dream)
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t find that dream.
        </p>
        <Link
          href="/dashboard/dreams"
          className="text-violet-500 hover:underline"
        >
          Back to journal
        </Link>
      </div>
    );

  const busy = dream.status === "pending" || dream.status === "analyzing";

  const onDelete = async () => {
    await removeDream({ id: dream._id as DreamId });
    toast.success("Dream deleted");
    router.push("/dashboard/dreams");
  };

  const onRetry = async () => {
    setModalHidden(false); // show the modal again for the new attempt
    await retryDream({ id: dream._id as DreamId });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/*
        Opens the moment the dream is saved and closes by itself when the
        Convex query flips status to "ready" (or "failed"): no polling,
        no extra state to keep in sync.
      */}
      <DreamGeneratingModal
        open={busy && !modalHidden}
        variant="dream"
        onClose={() => setModalHidden(true)}
      />

      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/dreams"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Journal
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this dream?</AlertDialogTitle>
              <AlertDialogDescription>
                The dream and its reading will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          {dream.title ?? dream.analysis?.suggestedTitle ?? "Your dream"}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{format(parseISO(dream.dreamDate), "EEEE d MMMM yyyy")}</span>
          {dream.recurring && <Badge variant="secondary">Recurring</Badge>}
          {dream.lucid && <Badge variant="secondary">Lucid</Badge>}
          {dream.emotions.map((e) => (
            <Badge key={e} variant="outline">
              {e}
            </Badge>
          ))}
        </div>
      </header>

      <Card>
        <CardContent className="whitespace-pre-wrap pt-6 text-sm leading-relaxed">
          {dream.description}
        </CardContent>
      </Card>

      {/* Inline fallback only once the modal has been tucked away */}
      {busy && modalHidden && <AnalyzingState />}

      {dream.status === "failed" && (
        <Card className="border-red-500/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="text-sm text-red-500">
              {dream.errorMessage ?? "The analysis failed."}
            </p>
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw className="mr-2 h-4 w-4" /> Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {dream.status === "ready" && dream.analysis && (
        <AnalysisView analysis={dream.analysis} />
      )}
    </div>
  );
}
