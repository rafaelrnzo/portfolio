export function optimizeProjectImageSrc(src) {
  if (!src) return src;

  try {
    const url = new URL(src);
    const uploadPath = "/image/upload/";

    if (url.hostname !== "res.cloudinary.com") return src;

    const uploadIndex = url.pathname.indexOf(uploadPath);
    if (uploadIndex === -1) return src;

    const prefix = url.pathname.slice(0, uploadIndex + uploadPath.length);
    const rest = url.pathname.slice(uploadIndex + uploadPath.length);
    const firstSegment = rest.split("/", 1)[0] ?? "";

    if (firstSegment.includes("f_auto") || firstSegment.includes("q_auto")) {
      return src;
    }

    url.pathname = `${prefix}f_auto,q_auto,w_1200/${rest}`;
    return url.toString();
  } catch {
    return src;
  }
}
