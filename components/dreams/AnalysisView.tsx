"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Compass,
  Eye,
  HeartPulse,
  HelpCircle,
  Link2,
  ShieldAlert,
  Sparkles,
  Sprout,
  Waves,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Analysis = NonNullable<Doc<"dreams">["analysis"]>;

function Section({
  icon: Icon,
  title,
  delay = 0,
  children,
  tone = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  delay?: number;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={tone}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-4 w-4 text-violet-500" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

export function AnalysisView({ analysis }: { analysis: Analysis }) {
  const a = analysis;
  return (
    <div className="space-y-4">
      {a.wellbeingNote && (
        <Section
          icon={ShieldAlert}
          title="A note about how you're doing"
          tone="border-amber-500/50 bg-amber-500/5"
        >
          <p>{a.wellbeingNote}</p>
        </Section>
      )}

      <Section icon={Eye} title="The reading">
        <p className="text-base">{a.summary}</p>
        <Badge variant="secondary">{a.emotionalTone}</Badge>
      </Section>

      {a.symbols.length > 0 && (
        <Section icon={Sparkles} title="Symbols" delay={0.05}>
          <div className="grid gap-3 sm:grid-cols-2">
            {a.symbols.map((s, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="font-semibold text-violet-600 dark:text-violet-400">
                  {s.symbol}
                </p>
                <p className="text-muted-foreground">{s.meaning}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {a.lifeConnections.length > 0 && (
        <Section icon={Link2} title="How it connects to your life" delay={0.1}>
          {a.lifeConnections.map((c, i) => (
            <div key={i}>
              <p className="font-semibold">{c.lifeEvent}</p>
              <p className="text-muted-foreground">{c.connection}</p>
            </div>
          ))}
        </Section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {a.deepWorries.length > 0 && (
          <Section icon={HeartPulse} title="Deeper worries" delay={0.15}>
            <Bullets items={a.deepWorries} />
          </Section>
        )}
        {a.strengthsAndSuccesses.length > 0 && (
          <Section
            icon={Sprout}
            title="Strengths & signs of success"
            delay={0.2}
          >
            <Bullets items={a.strengthsAndSuccesses} />
          </Section>
        )}
      </div>

      {a.emotionalThemes.length > 0 && (
        <Section icon={Waves} title="Emotional themes" delay={0.25}>
          <div className="flex flex-wrap gap-2">
            {a.emotionalThemes.map((t, i) => (
              <Badge key={i} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {a.psychology.length > 0 && (
        <Section icon={Brain} title="The psychology behind it" delay={0.3}>
          {a.psychology.map((p, i) => (
            <div key={i}>
              <p className="font-semibold">{p.lens}</p>
              <p className="text-muted-foreground">{p.insight}</p>
            </div>
          ))}
        </Section>
      )}

      {a.reflectionQuestions.length > 0 && (
        <Section icon={HelpCircle} title="Questions to sit with" delay={0.35}>
          <Bullets items={a.reflectionQuestions} />
        </Section>
      )}

      <Section icon={Compass} title="Gentle guidance" delay={0.4}>
        <p>{a.gentleGuidance}</p>
      </Section>

      <p className="px-1 text-xs text-muted-foreground">
        Dream interpretation is a tool for reflection, not a scientific or
        medical diagnosis. If something here feels heavy, consider talking to
        someone you trust or a mental-health professional.
      </p>
    </div>
  );
}
