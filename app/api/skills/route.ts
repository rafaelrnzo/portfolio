import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type SkillRow = {
  id: string;
  skill: string | null;
};

export async function GET() {
  try {
    const db = getDb();
    const rows = (await db`
      select id, skill
      from skills
      order by created_at asc nulls last, skill asc
    `) as SkillRow[];

    return NextResponse.json(rows, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("GET /api/skills failed:", err);
    return NextResponse.json(
      { error: "Failed to load skills." },
      { status: 500 }
    );
  }
}
