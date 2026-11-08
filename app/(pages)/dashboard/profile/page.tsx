"use client";

import { ProfileForm } from "@/components/dreams/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your background</h1>
        <p className="text-muted-foreground">
          The more honestly you fill this in, the more personal and accurate
          your dream readings will be. You can update it any time as life
          changes.
        </p>
      </div>
      <ProfileForm redirectTo="/dashboard" />
    </div>
  );
}
