"use client";

import { useState, useCallback } from "react";

export interface StoreActions<T extends { id: string }> {
  items: T[];
  getById: (id: string) => T | undefined;
  create: (item: T) => void;
  update: (id: string, data: Partial<T>) => void;
  remove: (id: string) => void;
}

export function useMockStore<T extends { id: string }>(initial: T[]): StoreActions<T> {
  const [items, setItems] = useState<T[]>(initial);

  const getById = useCallback(
    (id: string) => items.find((i) => i.id === id),
    [items]
  );

  const create = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback((id: string, data: Partial<T>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, getById, create, update, remove };
}
