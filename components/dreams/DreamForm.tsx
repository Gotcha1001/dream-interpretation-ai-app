"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useDreamActions } from "@/hooks/useDreams";
import { DREAM_EMOTIONS, todayISO } from "@/lib/dreamOptions";
import { DreamGeneratingModal } from "@/components/dreams/DreamGeneratingModal";

const MIN = 30;

export function DreamForm() {
  const router = useRouter();
  const { createDream } = useDreamActions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamDate, setDreamDate] = useState(todayISO());
  const [emotions, setEmotions] = useState<string[]>([]);
  const [recurring, setRecurring] = useState(false);
  const [lucid, setLucid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleEmotion = (e: string) =>
    setEmotions((cur) =>
      cur.includes(e)
        ? cur.filter((x) => x !== e)
        : cur.length < 8
          ? [...cur, e]
          : cur,
    );

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (description.trim().length < MIN) {
      toast.error(
        "Tell us a bit more about the dream: places, people, feelings.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const id = await createDream({
        title: title.trim() || undefined,
        description,
        dreamDate,
        emotions,
        recurring,
        lucid,
      });
      // Deliberately NOT calling setSubmitting(false) on success: the modal
      // stays up through the route change, and the detail page re-opens the
      // same modal while the dream's status is pending/analyzing, so the
      // user sees one continuous "generating" experience.
      router.push(`/dashboard/dreams/${id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your dream");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Locked (no onClose): can't be dismissed while the dream is saving */}
      <DreamGeneratingModal open={submitting} variant="dream" />

      <form onSubmit={submit}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="We'll suggest one if you leave this blank"
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">When did you dream it?</Label>
                <Input
                  id="date"
                  type="date"
                  max={todayISO()}
                  value={dreamDate}
                  onChange={(e) => setDreamDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dream">Describe your dream</Label>
              <Textarea
                id="dream"
                rows={10}
                value={description}
                maxLength={8000}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Where were you? Who was there? What happened? Include odd details and how it ended, even if it doesn't make sense."
              />
              <p className="text-right text-xs text-muted-foreground">
                {description.length} / 8000
              </p>
            </div>

            <div className="space-y-2">
              <Label>How did it feel? (pick up to 8)</Label>
              <div className="flex flex-wrap gap-2">
                {DREAM_EMOTIONS.map((e) => {
                  const on = emotions.includes(e);
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleEmotion(e)}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        on
                          ? "border-violet-500 bg-violet-600 text-white"
                          : "hover:border-violet-400 hover:bg-violet-500/10"
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-8">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={recurring} onCheckedChange={setRecurring} />{" "}
                I&apos;ve had this dream before
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={lucid} onCheckedChange={setLucid} /> I knew I
                was dreaming
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full bg-violet-600 text-white hover:bg-violet-500 sm:w-auto"
            >
              <Moon className="mr-2 h-4 w-4" />
              Interpret my dream
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
