"use client";

import React, { useEffect, useMemo, useState } from "react";
import Container from "@/components/shared/container";
import ProjectCard from "@/components/project-card";
import { supabase } from "@/lib/supabase-client";

type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
  imageSrc?: string;
};

type SkillRelation = {
  skill: string | null;
};

type TechStackRow = {
  skills: SkillRelation | null; 
};

type ProjectRow = {
  id: string;
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  git_link: string | null;
  demo_link: string | null;
  created_at: string;
  project_tech_stacks: TechStackRow[]; 
};

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pageSize = 5;
  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            `
            id,
            title,
            thumbnail,
            description,
            git_link,
            demo_link,
            created_at,
            project_tech_stacks (
              skills (
                skill
              )
            )
          `
          )
          .order("created_at", { ascending: false })
          .returns<ProjectRow[]>();

        if (error) {
          throw error;
        }

        const mapped: Project[] = (data || []).map((row) => {
          const tech =
            row.project_tech_stacks
              ?.map((pts) => pts.skills?.skill)
              .filter((s): s is string => typeof s === "string") ?? [];

          return {
            title: row.title ?? "",
            description: row.description ?? "",
            tech, 
            href: row.demo_link ?? undefined,
            repo: row.git_link ?? undefined,
            imageSrc: row.thumbnail ?? undefined,
          };
        });

        setProjects(mapped);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setErrorMsg(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [page, projects]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setPage((p) => Math.min(totalPages, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  return (
    <Container
      size="large"
      className="prose prose-neutral container animate-page"
    >
      <h1 className="mb-6 text-xl font-medium tracking-tight">Projects</h1>

      <div className="not-prose flex flex-col gap-4">
        {loading &&
          !errorMsg &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-foreground/5 p-4 animate-pulse space-y-3"
            >
              <div className="h-4 w-1/3 rounded bg-foreground/10" />
              <div className="h-3 w-2/3 rounded bg-foreground/10" />
              <div className="h-3 w-1/2 rounded bg-foreground/10" />
              <div className="h-24 w-full rounded bg-foreground/5" />
            </div>
          ))}

        {errorMsg && !loading && (
          <p className="text-[15px] text-red-500">
            Failed to load projects: {errorMsg}
          </p>
        )}

        {!loading &&
          !errorMsg &&
          slice.map((p, i) => (
            <div
              key={`${p.title}-${i}`}
              className="project-anim"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <ProjectCard {...p} />
            </div>
          ))}

        {!loading && !errorMsg && projects.length === 0 && (
          <p className="text-[15px] opacity-70">
            No projects found. Please check back later.
          </p>
        )}
      </div>

      {!loading && !errorMsg && projects.length > 0 && (
        <nav
          className="not-prose mt-4 flex items-center justify-between"
          aria-label="Project pagination"
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-foreground/10 px-3 py-2 text-[14px] text-foreground/80 transition hover:bg-foreground/[0.02] hover:border-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous projects"
          >
            ← Previous
          </button>

          <span className="text-[13px] text-foreground/60">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-foreground/10 px-3 py-2 text-[14px] text-foreground/80 transition hover:bg-foreground/[0.02] hover:border-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next projects"
          >
            Next →
          </button>
        </nav>
      )}
    </Container>
  );
}