"use client";

import Container from "@/components/shared/container";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

type WorkItem = {
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
};

type ExperienceRow = {
  id: string;
  company: string | null;
  role: string | null;
  from: string | null; 
  to: string | null;
  summary: string | null;
  bullets: string[] | null;
  company_link: string | null;
};

function formatMonthYear(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return dateStr;
  }
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function buildPeriod(from: string | null, to: string | null): string {
  const fromLabel = formatMonthYear(from);
  const toLabel = to ? formatMonthYear(to) : "Present";

  if (fromLabel && toLabel) return `${fromLabel} - ${toLabel}`;
  if (fromLabel && !toLabel) return fromLabel;
  if (!fromLabel && toLabel) return toLabel;
  return "";
}

export default function Work() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select('id, company, role, "from", "to", summary, bullets, company_link')
        .order("from", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      const mapped: WorkItem[] =
        (data ?? []).map((row) => ({
          company: row.company ?? "",
          role: row.role ?? "",
          period: buildPeriod(row.from, row.to),
          summary: row.summary ?? "",
          bullets: (row.bullets ?? []) as string[],
        })) ?? [];

      setWorkItems(mapped);
      setLoading(false);
    };

    fetchExperiences();
  }, []);

  return (
    <Container size="large" className="animate-page">
      <main className="prose prose-neutral">
        <header className="mb-8 fade-item" style={{ animationDelay: "80ms" }}>
          <p className="text-[15px] leading-relaxed opacity-80">
            On a mission to craft software that blends design, intelligence, and
            reliability. Below is an overview of my professional journey each
            role shaped by a commitment to technical depth, collaboration, and
            meaningful user impact.
          </p>
        </header>

        <section className="space-y-8">
          {/* Skeleton saat loading */}
          {loading && !error && (
            <div className="space-y-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-foreground/5 p-4 animate-pulse"
                >
                  <div className="h-4 w-40 rounded bg-foreground/10 mb-2" />
                  <div className="h-3 w-56 rounded bg-foreground/10 mb-4" />
                  <div className="h-3 w-full rounded bg-foreground/10 mb-2" />
                  <div className="h-3 w-5/6 rounded bg-foreground/10 mb-2" />
                  <div className="h-3 w-2/3 rounded bg-foreground/10" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <p className="text-[15px] text-red-500">
              Failed to load experiences: {error}
            </p>
          )}

          {/* Konten utama */}
          {!loading &&
            !error &&
            workItems.map((item, index) => (
              <article
                key={`${item.company}-${item.period}-${index}`}
                className="mb-4 fade-item"
                // tanpa stagger besar, biar lebih halus
                style={{ animationDelay: "120ms" }}
              >
                <header className="mb-3">
                  <h2 className="font-medium text-xl mb-1 tracking-tight">
                    {item.company}
                  </h2>
                  <time className="opacity-60 text-[15px] tracking-tight flex items-center gap-2">
                    <span>{item.role}</span>
                    {item.period && (
                      <>
                        <span className="text-xs">•</span>
                        <span>{item.period}</span>
                      </>
                    )}
                  </time>
                </header>

                <p className="text-[15px] leading-relaxed opacity-80">
                  {item.summary}
                </p>

                {item.bullets.length > 0 && (
                  <ul className="text-[15px] leading-relaxed opacity-80 mt-3">
                    {item.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

          {!loading && !error && workItems.length === 0 && (
            <p className="text-[15px] opacity-70">
              Belum ada experience di Supabase.
            </p>
          )}
        </section>
      </main>
    </Container>
  );
}
