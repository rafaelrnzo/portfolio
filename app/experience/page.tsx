import { normalizeStringArray } from "@/app/api/_utils/pg";
import Container from "@/components/shared/container";
import { getDb } from "@/lib/db";

export const revalidate = 3600;

type WorkItem = {
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
};

type ExperienceRow = {
  company: string | null;
  role: string | null;
  from: string | null;
  to: string | null;
  summary: string | null;
  bullets: unknown;
};

function formatMonthYear(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function buildPeriod(from: string | null, to: string | null): string {
  const fromLabel = formatMonthYear(from);
  const toLabel = to ? formatMonthYear(to) : "Present";

  if (fromLabel && toLabel) return `${fromLabel} - ${toLabel}`;
  if (fromLabel) return fromLabel;
  if (toLabel) return toLabel;
  return "";
}

async function getWorkItems(): Promise<WorkItem[]> {
  const db = getDb();
  const rows = (await db`
    select
      company,
      role,
      "from",
      "to",
      summary,
      bullets
    from experiences
    order by "from" desc nulls last
  `) as ExperienceRow[];

  return rows.map((row) => ({
    company: row.company ?? "",
    role: row.role ?? "",
    period: buildPeriod(row.from, row.to),
    summary: row.summary ?? "",
    bullets: normalizeStringArray(row.bullets),
  }));
}

export default async function Work() {
  const workItems = await getWorkItems();

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
          {workItems.map((item, index) => (
            <article
              key={`${item.company}-${item.period}-${index}`}
              className="mb-4 fade-item"
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
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          {workItems.length === 0 && (
            <p className="text-[15px] opacity-70">Belum ada experience.</p>
          )}
        </section>
      </main>
    </Container>
  );
}
