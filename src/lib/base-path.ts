/** Returns the Next.js basePath (e.g. "/vecindad360") or "" if none is set. */
export function getBasePath(): string {
  if (typeof window !== "undefined") {
    const data = (window as unknown as Record<string, { basePath?: string }>)
      .__NEXT_DATA__;
    return data?.basePath || "";
  }
  return "";
}
