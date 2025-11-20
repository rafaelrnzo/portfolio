// app/admin/experiences/types.ts (optional, or inline in page.tsx)
export interface Experience {
  id: string;
  company: string | null;
  role: string | null;
  from: string | null; // ISO date string
  to: string | null;
  summary: string | null;
  bullets: string[] | null;
  company_link: string | null;
  created_at: string;
}

export function formatPeriod(from: string | null, to: string | null) {
  if (!from) return '-';

  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : null;

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const fromStr = fmt(fromDate);
  const toStr = toDate ? fmt(toDate) : 'Present';

  return `${fromStr} - ${toStr}`;
}

export function bulletsArrayToText(bullets: string[] | null | undefined) {
  if (!bullets || !bullets.length) return '';
  return bullets.join('\n');
}

export function bulletsTextToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
