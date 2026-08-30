import Link from "next/link";
import type { Metadata } from "next";

import { getThoughts } from "@/app/db/thoughts";
import Container from "@/components/shared/container";
import { ThoughtCard } from "@/components/thought-card";
import { ThoughtsMDX } from "@/components/thoughts-mdx";

export const metadata: Metadata = {
  title: "Thoughts",
  description: "Quick thoughts, ideas, code snippets, quotes, and book notes.",
};

const thoughtsPerPage = 8;
const typeFilters = [
  { key: "all", label: "All" },
  { key: "code", label: "Code" },
  { key: "idea", label: "Idea" },
  { key: "quote", label: "Quote" },
  { key: "book", label: "Book" },
] as const;

type FilterKey = (typeof typeFilters)[number]["key"];
type ThoughtsPageProps = {
  searchParams: Promise<{ page?: string; type?: string }>;
};

function validFilter(type: string | undefined): FilterKey {
  return typeFilters.some((filter) => filter.key === type)
    ? (type as FilterKey)
    : "all";
}

function thoughtsHref(type: FilterKey, page = 1) {
  const params = new URLSearchParams();
  if (type !== "all") params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/thoughts?${query}` : "/thoughts";
}

export default async function ThoughtsPage({ searchParams }: ThoughtsPageProps) {
  const { page = "1", type } = await searchParams;
  const filter = validFilter(type);
  const thoughts = getThoughts().sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );
  const filteredThoughts =
    filter === "all"
      ? thoughts
      : thoughts.filter((thought) => thought.metadata.type === filter);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredThoughts.length / thoughtsPerPage)
  );
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const paginatedThoughts = filteredThoughts.slice(
    (currentPage - 1) * thoughtsPerPage,
    currentPage * thoughtsPerPage
  );
  const renderedThoughts = paginatedThoughts.map((thought) => ({
    ...thought,
    renderedContent: <ThoughtsMDX source={thought.content} />,
  }));

  return (
    <Container size="large">
      <div className="pb-32">
        <div>
          {renderedThoughts.map((thought) => (
            <ThoughtCard key={thought.slug} thought={thought} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Thoughts pagination"
            className="flex justify-center gap-4 mt-12"
          >
            {currentPage > 1 ? (
              <Link
                href={thoughtsHref(filter, currentPage - 1)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/10 px-4 text-sm tracking-tight transition hover:bg-foreground/[0.02]"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/10 px-4 text-sm tracking-tight opacity-30">
                Previous
              </span>
            )}

            <span className="flex items-center tracking-tight text-sm opacity-50">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={thoughtsHref(filter, currentPage + 1)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/10 px-4 text-sm tracking-tight transition hover:bg-foreground/[0.02]"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/10 px-4 text-sm tracking-tight opacity-30">
                Next
              </span>
            )}
          </nav>
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg px-3 py-2">
            <div className="flex items-center gap-1">
              {typeFilters.map((filterOption) => (
                <Link
                  key={filterOption.key}
                  href={thoughtsHref(filterOption.key)}
                  className={`relative rounded-full px-4 py-2 text-xs tracking-wider transition ${
                    filter === filterOption.key
                      ? "bg-foreground text-background"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {filterOption.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
