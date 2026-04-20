import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { normalizeStringArray } from "@/app/api/_utils/pg";

export const dynamic = "force-dynamic";

type ProjectRow = {
  id: string;
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  git_link: string | null;
  demo_link: string | null;
  created_at: string | null;
  tech: unknown;
};

export async function GET() {
  try {
    const db = getDb();

    const rows = (await db`
      select
        p.id,
        p.title,
        p.thumbnail,
        p.description,
        p.git_link,
        p.demo_link,
        p.created_at,
        coalesce(array_remove(array_agg(s.skill order by s.skill), null), '{}'::text[]) as tech
      from projects p
      left join project_tech_stacks pts on pts.project_id = p.id
      left join skills s on s.id = pts.skill_id
      group by p.id
      order by p.created_at desc nulls last
    `) as ProjectRow[];

    const normalized = rows.map((r) => ({
      ...r,
      tech: normalizeStringArray(r.tech),
    }));

    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("GET /api/projects failed:", err);
    return NextResponse.json(
      { error: "Failed to load projects." },
      { status: 500 }
    );
  }
}
