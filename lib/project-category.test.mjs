import assert from "node:assert/strict";
import {
  allProjectCategory,
  isProjectCategory,
  normalizeProjectCategories,
} from "./project-category.mjs";

const categories = normalizeProjectCategories([
  { key: "web", label: "Web Development" },
  { key: "ai", label: "AI / ML" },
]);

assert.deepEqual(
  categories,
  [allProjectCategory, { key: "web", label: "Web Development" }, { key: "ai", label: "AI / ML" }]
);

assert.equal(isProjectCategory("ai", categories), true);
assert.equal(isProjectCategory("mobile", categories), false);
