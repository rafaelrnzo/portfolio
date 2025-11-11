"use client";

import React, { useEffect, useMemo, useState } from "react";
import Container from "@/components/shared/container";
import ProjectCard from "@/components/project-card";

type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
  imageSrc?: string;
};

const allProjects: Project[] = [
  {
    title: "Haruma v3 – Fragrance Analytics",
    description:
      "E-commerce & analytics parfum: admin dashboard, dynamic filters, RLS Supabase, dan UI konsisten.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Recharts"],
    href: "https://haruma.example.com",
    repo: "https://github.com/rafaelrnzo/haruma-v3",
    imageSrc: "/images/image.jpg",
  },
  {
    title: "AI Generative Question Service",
    description:
      "Microservice FastAPI untuk MCQ/essay berbasis RAG: BGE embeddings, Redis vector index, evaluasi cepat.",
    tech: ["FastAPI", "Python", "Redis", "BGE-m3", "vLLM/Ollama"],
    repo: "https://github.com/rafaelrnzo/ai_generative_question_v2",
    // imageSrc: "/images/projects/ai-gq.jpg",
  },
  {
    title: "ERPNext – SD Asset Module",
    description:
      "Manajemen aset ERPNext: movement, borrowed asset, stock sync, dan validasi real-time.",
    tech: ["ERPNext (Frappe)", "Python", "MariaDB", "Redis"],
    href: "https://demo.example.com/asset",
  },
  {
    title: "LiveKit Meet Custom UI",
    description:
      "UI meeting kustom: screen share, whiteboard, E2EE, fokus pada performa dan aksesibilitas.",
    tech: ["Next.js", "LiveKit", "TypeScript"],
    repo: "https://github.com/rafaelrnzo/livekit-meet-custom",
  },
  {
    title: "AI Screening CV",
    description:
      "RAG untuk screening CV: match JD vs kandidat, scoring rubric, dan ringkasan rekomendasi.",
    tech: ["FastAPI", "Redis-Stack", "PostgreSQL", "LangChain"],
  },
];

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const total = allProjects.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allProjects.slice(start, start + pageSize);
  }, [page]);

  // keyboard: ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setPage((p) => Math.min(totalPages, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  return (
    <Container size="large" className="prose prose-neutral container animate-enter">
      <h1 className="mb-6 text-xl font-medium tracking-tight">Projects</h1>

      <div className="not-prose flex flex-col gap-4">
        {slice.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>

      <nav className="not-prose mt-6 flex items-center justify-between" aria-label="Project pagination">
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
    </Container>
  );
}
