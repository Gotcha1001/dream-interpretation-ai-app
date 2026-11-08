"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Brain, HeartPulse, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Moon,
    title: "Tell us about your life",
    text: "Share your relationships, family, recent losses and wins once. It stays private and shapes every reading.",
  },
  {
    icon: Sparkles,
    title: "Describe your dream",
    text: "Write it as you remember it, strange details included. Add how it felt and whether it keeps coming back.",
  },
  {
    icon: Brain,
    title: "Get a personal reading",
    text: "Symbols, the psychology behind them, and how the dream links to what you are living through right now.",
  },
  {
    icon: HeartPulse,
    title: "See worries and strengths",
    text: "Your dreams reveal what you fear and what you are quietly succeeding at. You get both.",
  },
];

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard");
  }, [isSignedIn, router]);

  return (
    <div className="mx-auto max-w-5xl space-y-20 py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <div className="text-6xl">🌙</div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          What is your{" "}
          <span className="bg-gradient-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">
            dream
          </span>{" "}
          really saying?
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          An AI dream interpreter that knows your story. It reads your dreams
          alongside your life, your worries and your wins, so the meaning is
          yours and not a generic dictionary entry.
        </p>
        <div className="flex justify-center gap-3">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button
              size="lg"
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Interpret my dreams
            </Button>
          </SignInButton>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">
              Create account
            </Button>
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-6 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border p-6"
          >
            <Icon className="mb-3 h-6 w-6 text-violet-500" />
            <h3 className="mb-1 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </motion.div>
        ))}
      </section>

      <p className="text-center text-xs text-muted-foreground">
        For reflection and entertainment. Not medical or psychological advice.
      </p>
    </div>
  );
}
