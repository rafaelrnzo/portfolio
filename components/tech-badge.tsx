"use client";

import { supabase } from "@/lib/supabase-client";
import React, { useEffect, useState } from "react";

type ToolButtonProps = {
  label: string;
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

type SkillItem = {
  id: string;
  skill: string;
};

export default function TechBadge() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("skills")
        .select("id, skill")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching skills:", error);
        setLoading(false);
        return;
      }

      setSkills(data || []);
      setLoading(false);
    };

    fetchSkills();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {loading &&
        Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-20 h-7 rounded-lg bg-foreground/10 animate-pulse"
          />
        ))}

      {!loading &&
        skills.map((item) => (
          <ToolButton key={item.id} label={item.skill} />
        ))}
    </div>
  );
}