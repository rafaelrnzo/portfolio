import assert from "node:assert/strict";
import { optimizeProjectImageSrc } from "./project-image.mjs";

assert.equal(
  optimizeProjectImageSrc(
    "https://res.cloudinary.com/dwuuwldcw/image/upload/v1788002197/MacBook_1_tcymez.png"
  ),
  "https://res.cloudinary.com/dwuuwldcw/image/upload/f_auto,q_auto,w_1200/v1788002197/MacBook_1_tcymez.png"
);

assert.equal(
  optimizeProjectImageSrc(
    "https://res.cloudinary.com/dwuuwldcw/image/upload/f_auto,q_auto,w_1200/v1788002197/MacBook_1_tcymez.png"
  ),
  "https://res.cloudinary.com/dwuuwldcw/image/upload/f_auto,q_auto,w_1200/v1788002197/MacBook_1_tcymez.png"
);

assert.equal(optimizeProjectImageSrc("/images/test.jpeg"), "/images/test.jpeg");
