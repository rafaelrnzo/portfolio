import Link from "next/link";

import ProjectCard from "@/components/project-card";
import Container from "@/components/shared/container";
import { normalizeStringArray } from "@/app/api/_utils/pg";
import { getDb } from "@/lib/db";
import {
  isProjectCategory,
  normalizeProjectCategories,
} from "@/lib/project-category.mjs";

export const revalidate = 3600;

type Project = {
  title: string;
  description: string;
  tech: string[];
  categoryKeys: string[];
  href?: string;
  repo?: string;
  imageSrc?: string;
};

type ProjectCategory = {
  key: string;
  label: string;
};

type ProjectRow = {
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  git_link: string | null;
  demo_link: string | null;
  tech: unknown;
  category_keys: unknown;
};

type ProjectsPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

async function getProjectData(): Promise<{
  categories: ProjectCategory[];
  projects: Project[];
}> {
  const db = getDb();
  const [categoryRows, rows] = await Promise.all([
    db`
      select key, label
      from project_categories
      order by sort_order asc, label asc
    `,
    db`
      select
        p.id,
        p.title,
        p.thumbnail,
        p.description,
        p.git_link,
        p.demo_link,
        p.created_at,
        coalesce(array_remove(array_agg(distinct s.skill order by s.skill), null), '{}'::text[]) as tech,
        coalesce(array_remove(array_agg(distinct pc.key order by pc.key), null), '{}'::text[]) as category_keys
      from projects p
      left join project_tech_stacks pts on pts.project_id = p.id
      left join skills s on s.id = pts.skill_id
      left join skill_categories sc on sc.skill_id = s.id
      left join project_categories pc on pc.id = sc.category_id
      group by p.id
      order by p.created_at desc nulls last
    `,
  ]);

  const projects = (rows as ProjectRow[]).map((row) => ({
    title: row.title ?? "",
    description: row.description ?? "",
    tech: normalizeStringArray(row.tech),
    categoryKeys: normalizeStringArray(row.category_keys),
    href: row.demo_link ?? undefined,
    repo: row.git_link ?? undefined,
    imageSrc: row.thumbnail ?? undefined,
  }));

  return {
    categories: normalizeProjectCategories(categoryRows),
    projects: [
      ...projects.filter((p) => p.imageSrc && p.imageSrc.trim().length > 0),
      ...projects.filter((p) => !p.imageSrc || p.imageSrc.trim().length === 0),
    ],
  };
}

function projectHref(category: string, page = 1) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/project?${query}` : "/project";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { category, page = "1" } = await searchParams;
  const { categories, projects } = await getProjectData();
  const activeCategory = isProjectCategory(category, categories)
    ? category!
    : "all";
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categoryKeys.includes(activeCategory)
        );
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const slice = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const categoryCounts = new Map(
    categories.map((category) => [
      category.key,
      category.key === "all"
        ? projects.length
        : projects.filter((project) =>
            project.categoryKeys.includes(category.key)
          ).length,
    ])
  );

  return (
    <Container
      size="large"
      className="prose prose-neutral container animate-page"
    >
      <h1 className="mb-4 text-xl font-medium tracking-tight">Projects</h1>

      <nav
        className="not-prose mb-6 flex flex-wrap gap-2"
        aria-label="Project categories"
      >
        {categories.map((category) => {
          const active = activeCategory === category.key;
          const count = categoryCounts.get(category.key) ?? 0;

          return (
            <Link
              key={category.key}
              href={projectHref(category.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] tracking-tight transition ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/10 text-foreground/70 hover:border-foreground/20 hover:bg-foreground/[0.02] hover:text-foreground"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span>{category.label}</span>
              <span
                className={`text-[11px] ${
                  active ? "text-background/70" : "text-foreground/40"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="not-prose flex flex-col gap-4">
        {slice.map((p, i) => (
          <div
            key={`${p.title}-${i}`}
            className="project-anim"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <ProjectCard
              {...p}
              imagePriority={currentPage === 1 && i === 0}
            />
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-[15px] opacity-70">
            No projects found. Please check back later.
          </p>
        )}
      </div>

      {filteredProjects.length > 0 && (
        <nav
          className="not-prose mt-4 flex items-center justify-between"
          aria-label="Project pagination"
        >
          {currentPage > 1 ? (
            <Link
              href={projectHref(activeCategory, currentPage - 1)}
              className="rounded-lg border border-foreground/10 px-3 py-1.5 text-[14px] text-foreground/80 transition hover:bg-foreground/[0.02] hover:border-foreground/20"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-foreground/10 px-3 py-1.5 text-[14px] text-foreground/80 opacity-40">
              Previous
            </span>
          )}

          <span className="text-[13px] text-foreground/60">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={projectHref(activeCategory, currentPage + 1)}
              className="rounded-lg border border-foreground/10 px-3 py-1.5 text-[14px] text-foreground/80 transition hover:bg-foreground/[0.02] hover:border-foreground/20"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-foreground/10 px-3 py-1.5 text-[14px] text-foreground/80 opacity-40">
              Next
            </span>
          )}
        </nav>
      )}
    </Container>
  );
}
