"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import {
  AGE_RANGES,
  FAMILY_RELATIONS,
  MARITAL_STATUSES,
  SLEEP_QUALITY,
  WHEN_AGO,
} from "@/lib/dreamOptions";
import { ListEditor, RemoveButton } from "./ListEditor";

const eventSchema = z.object({
  title: z.string().min(1, "Give it a short title").max(120),
  whenAgo: z.string(),
  details: z.string().max(600),
});

const schema = z.object({
  ageRange: z.string().min(1),
  maritalStatus: z.string().min(1),
  relationshipNotes: z.string().max(400),
  occupation: z.string().max(100),
  familyMembers: z.array(
    z.object({
      relation: z.string().min(1),
      name: z.string().max(60),
      notes: z.string().max(300),
    }),
  ),
  recentTragedies: z.array(eventSchema),
  recentPositives: z.array(eventSchema),
  currentStressors: z.string().max(800),
  currentHopes: z.string().max(800),
  sleepQuality: z.string(),
  culturalBackground: z.string().max(200),
});
type FormValues = z.infer<typeof schema>;

const blank = (s: string) => s.trim() || undefined;
const field = "space-y-1.5";

export function ProfileForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { profile, isLoading, save } = useProfile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ageRange: "25-34",
      maritalStatus: "single",
      relationshipNotes: "",
      occupation: "",
      familyMembers: [],
      recentTragedies: [],
      recentPositives: [],
      currentStressors: "",
      currentHopes: "",
      sleepQuality: "Okay",
      culturalBackground: "",
    },
    // Fill the form from Convex once the saved profile loads
    values: profile
      ? {
          ageRange: profile.ageRange,
          maritalStatus: profile.maritalStatus,
          relationshipNotes: profile.relationshipNotes ?? "",
          occupation: profile.occupation ?? "",
          familyMembers: profile.familyMembers.map((f) => ({
            relation: f.relation,
            name: f.name ?? "",
            notes: f.notes ?? "",
          })),
          recentTragedies: profile.recentTragedies.map((e) => ({
            ...e,
            details: e.details ?? "",
          })),
          recentPositives: profile.recentPositives.map((e) => ({
            ...e,
            details: e.details ?? "",
          })),
          currentStressors: profile.currentStressors ?? "",
          currentHopes: profile.currentHopes ?? "",
          sleepQuality: profile.sleepQuality ?? "Okay",
          culturalBackground: profile.culturalBackground ?? "",
        }
      : undefined,
  });

  const family = useFieldArray({ control, name: "familyMembers" });
  const tragedies = useFieldArray({ control, name: "recentTragedies" });
  const positives = useFieldArray({ control, name: "recentPositives" });

  const onSubmit = async (v: FormValues) => {
    try {
      await save({
        ageRange: v.ageRange,
        maritalStatus: v.maritalStatus,
        relationshipNotes: blank(v.relationshipNotes),
        occupation: blank(v.occupation),
        familyMembers: v.familyMembers.map((f) => ({
          relation: f.relation,
          name: blank(f.name),
          notes: blank(f.notes),
        })),
        recentTragedies: v.recentTragedies.map((e) => ({
          ...e,
          details: blank(e.details),
        })),
        recentPositives: v.recentPositives.map((e) => ({
          ...e,
          details: blank(e.details),
        })),
        currentStressors: blank(v.currentStressors),
        currentHopes: blank(v.currentHopes),
        sleepQuality: v.sleepQuality,
        culturalBackground: blank(v.culturalBackground),
      });
      toast.success("Your background has been saved");
      reset(v);
      if (redirectTo) router.push(redirectTo);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  };

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading…</p>;

  const eventFields = (
    name: "recentTragedies" | "recentPositives",
    fields: typeof tragedies.fields,
    remove: (i: number) => void,
    placeholder: string,
  ) =>
    fields.map((f, i) => (
      <div key={f.id} className="space-y-2 rounded-lg border p-3">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            {...register(`${name}.${i}.title`)}
          />
          <NativeSelect {...register(`${name}.${i}.whenAgo`)}>
            {WHEN_AGO.map((w) => (
              <NativeSelectOption key={w}>{w}</NativeSelectOption>
            ))}
          </NativeSelect>
          <RemoveButton onClick={() => remove(i)} />
        </div>
        {errors[name]?.[i]?.title && (
          <p className="text-xs text-red-500">
            {errors[name]?.[i]?.title?.message}
          </p>
        )}
        <Textarea
          rows={2}
          placeholder="Anything else about how it affected you (optional)"
          {...register(`${name}.${i}.details`)}
        />
      </div>
    ));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
          <CardDescription>
            Used only to personalise your dream readings. Private to your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className={field}>
            <Label>Age range</Label>
            <NativeSelect className="w-full" {...register("ageRange")}>
              {AGE_RANGES.map((a) => (
                <NativeSelectOption key={a}>{a}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className={field}>
            <Label>Relationship status</Label>
            <NativeSelect className="w-full" {...register("maritalStatus")}>
              {MARITAL_STATUSES.map((m) => (
                <NativeSelectOption key={m.value} value={m.value}>
                  {m.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className={`${field} sm:col-span-2`}>
            <Label>How is your relationship going? (optional)</Label>
            <Input
              placeholder="e.g. Happy but we argue about money"
              {...register("relationshipNotes")}
            />
          </div>
          <div className={field}>
            <Label>Occupation (optional)</Label>
            <Input {...register("occupation")} />
          </div>
          <div className={field}>
            <Label>Recent sleep quality</Label>
            <NativeSelect className="w-full" {...register("sleepQuality")}>
              {SLEEP_QUALITY.map((s) => (
                <NativeSelectOption key={s}>{s}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className={`${field} sm:col-span-2`}>
            <Label>Cultural or faith background (optional)</Label>
            <Input
              placeholder="Symbols can mean different things in different traditions"
              {...register("culturalBackground")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Family & people close to you</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            label="Family members"
            hint="Anyone who matters to you, and how things are between you."
            addLabel="Add person"
            onAdd={() =>
              family.append({ relation: "Mother", name: "", notes: "" })
            }
            empty={family.fields.length === 0}
          >
            {family.fields.map((f, i) => (
              <div
                key={f.id}
                className="flex flex-wrap gap-2 rounded-lg border p-3"
              >
                <NativeSelect {...register(`familyMembers.${i}.relation`)}>
                  {FAMILY_RELATIONS.map((r) => (
                    <NativeSelectOption key={r}>{r}</NativeSelectOption>
                  ))}
                </NativeSelect>
                <Input
                  className="w-40"
                  placeholder="Name (optional)"
                  {...register(`familyMembers.${i}.name`)}
                />
                <Input
                  className="min-w-48 flex-1"
                  placeholder="How are things? e.g. distant lately"
                  {...register(`familyMembers.${i}.notes`)}
                />
                <RemoveButton onClick={() => family.remove(i)} />
              </div>
            ))}
          </ListEditor>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What&apos;s been happening lately</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ListEditor
            label="Recent tragedies or hard times"
            hint="Loss, illness, breakups, job loss… share only what you’re comfortable with."
            addLabel="Add difficult event"
            onAdd={() =>
              tragedies.append({ title: "", whenAgo: WHEN_AGO[0], details: "" })
            }
            empty={tragedies.fields.length === 0}
          >
            {eventFields(
              "recentTragedies",
              tragedies.fields,
              tragedies.remove,
              "e.g. Lost my father",
            )}
          </ListEditor>
          <ListEditor
            label="Recent positive experiences"
            hint="Wins, good news, milestones, moments of joy."
            addLabel="Add positive event"
            onAdd={() =>
              positives.append({ title: "", whenAgo: WHEN_AGO[0], details: "" })
            }
            empty={positives.fields.length === 0}
          >
            {eventFields(
              "recentPositives",
              positives.fields,
              positives.remove,
              "e.g. Got a promotion",
            )}
          </ListEditor>
          <div className={field}>
            <Label>What&apos;s stressing you right now?</Label>
            <Textarea rows={3} {...register("currentStressors")} />
          </div>
          <div className={field}>
            <Label>What are you hoping for?</Label>
            <Textarea rows={3} {...register("currentHopes")} />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-violet-600 text-white hover:bg-violet-500"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save my background
      </Button>
    </form>
  );
}
