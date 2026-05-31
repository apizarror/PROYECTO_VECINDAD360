"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBasePath } from "@/lib/base-path";

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${getBasePath()}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as Record<string, unknown>)?.error ?? res.statusText;
    throw new Error(String(message));
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// CRUD hooks
// ---------------------------------------------------------------------------

/** GET /api/{resource} */
export function useApiList<T>(resource: string) {
  return useQuery<T[]>({
    queryKey: [resource],
    queryFn: () => apiFetch<T[]>(`/api/${resource}`),
  });
}

/** GET /api/{resource}/{id} */
export function useApiGet<T>(resource: string, id: string | undefined) {
  return useQuery<T>({
    queryKey: [resource, id],
    queryFn: () => apiFetch<T>(`/api/${resource}/${id}`),
    enabled: !!id,
  });
}

/** POST /api/{resource} — invalidates list on success */
export function useApiCreate<T>(resource: string) {
  const qc = useQueryClient();
  return useMutation<T, Error, Partial<T>>({
    mutationFn: (body) =>
      apiFetch<T>(`/api/${resource}`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
    },
  });
}

/** PUT /api/{resource}/{id} — invalidates list + item on success */
export function useApiUpdate<T extends { id?: string }>(resource: string) {
  const qc = useQueryClient();
  return useMutation<T, Error, T>({
    mutationFn: (body) =>
      apiFetch<T>(`/api/${resource}/${body.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [resource] });
      if (variables.id) {
        qc.invalidateQueries({ queryKey: [resource, variables.id] });
      }
    },
  });
}

/** DELETE /api/{resource}/{id} — invalidates list on success */
export function useApiDelete(resource: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiFetch<void>(`/api/${resource}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
    },
  });
}
