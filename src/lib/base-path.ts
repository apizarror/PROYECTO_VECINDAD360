/**
 * Returns the Next.js basePath (e.g. "/vecindad360") or "" if none is set.
 *
 * Reads from `process.env.NEXT_PUBLIC_BASE_PATH`, which Next inlines into the
 * client bundle at build time (configured in `next.config.ts`). The App Router
 * does NOT expose `window.__NEXT_DATA__`, so we can't rely on it like the
 * Pages Router did.
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}
