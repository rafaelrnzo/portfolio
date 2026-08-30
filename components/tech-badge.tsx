import { getDb } from "@/lib/db";

type ToolButtonProps = {
  label: string;
};

type SkillItem = {
  id: string;
  skill: string | null;
};

export function ToolButton({ label }: ToolButtonProps) {
  return (
    <div className="flex items-center justify-between border border-foreground/10 rounded-lg px-4 py-2 hover:bg-foreground/[0.02] hover:border-foreground/20 transition-all group">
      <span className="text-sm tracking-tight text-foreground/80 group-hover:text-foreground">
        {label}
      </span>
    </div>
  );
}

async function getSkills(): Promise<SkillItem[]> {
  const db = getDb();
  return (await db`
    select id, skill
    from skills
    order by created_at asc nulls last, skill asc
  `) as SkillItem[];
}

export default async function TechBadge() {
  const skills = await getSkills();

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {skills.map((item) => (
        <ToolButton key={item.id} label={item.skill ?? ""} />
      ))}
    </div>
  );
}
