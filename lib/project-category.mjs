export const allProjectCategory = { key: "all", label: "All" };

export function normalizeProjectCategories(rows) {
  return [
    allProjectCategory,
    ...rows
      .map((row) => ({
        key: String(row.key ?? "").trim(),
        label: String(row.label ?? "").trim(),
      }))
      .filter((category) => category.key && category.label),
  ];
}

export function isProjectCategory(value, categories) {
  return categories.some((category) => category.key === value);
}
