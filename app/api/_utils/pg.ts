function parsePgTextArray(input: string): string[] {
  // Minimal parser for 1D Postgres text[] like: {a,b} or {"a,b","c"}.
  // If the format is unexpected, fall back to an empty list.
  const trimmed = input.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [];
  const body = trimmed.slice(1, -1);
  if (!body) return [];

  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  let escape = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      if (inQuotes) {
        escape = true;
        continue;
      }
      current += ch;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current);

  return out
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.toUpperCase() !== "NULL");
}

export function normalizeStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (typeof value === "string") {
    const str = value.trim();
    if (!str) return [];
    // jsonb array
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          return parsed.filter((v): v is string => typeof v === "string");
        }
      } catch {
        // ignore
      }
    }
    // text[] representation
    if (str.startsWith("{") && str.endsWith("}")) {
      return parsePgTextArray(str);
    }
  }
  return [];
}

