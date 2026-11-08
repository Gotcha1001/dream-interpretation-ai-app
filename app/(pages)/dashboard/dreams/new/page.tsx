"use client";

import { DreamForm } from "@/components/dreams/DreamForm";
import { ProfileGate } from "@/components/dreams/ProfileGate";

export default function NewDreamPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Record a dream</h1>
        <p className="text-muted-foreground">
          Write it down while it&apos;s fresh. Details matter, even the strange
          ones.
        </p>
      </div>
      <ProfileGate>
        <DreamForm />
      </ProfileGate>
    </div>
  );
}
