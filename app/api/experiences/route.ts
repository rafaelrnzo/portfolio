import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { normalizeStringArray } from "@/app/api/_utils/pg";

export const dynamic = "force-dynamic";

type ExperienceRow = {
  id: string;
  company: string | null;
  role: string | null;
  from: string | null;
  to: string | null;
  summary: string | null;
  bullets: unknown;
  company_link: string | null;
};

export async function GET() {
  try {
    const db = getDb();
    const rows = (await db`
      select
        id,
        company,
        role,
        "from",
        "to",
        summary,
        bullets,
        company_link
      from experiences
      order by "from" desc nulls last
    `) as ExperienceRow[];

    const normalized = rows.map((r) => ({
      ...r,
      bullets: normalizeStringArray(r.bullets),
    }));

    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("GET /api/experiences failed:", err);
    return NextResponse.json(
      { error: "Failed to load experiences." },
      { status: 500 }
    );
  }
}
