import { type Chantier } from "./types";

const KEY = "chantiers_v1";
const CHANGE_EVENT = "chantiers:change";
const EMPTY: Chantier[] = [];

let cachedRaw: string | null | undefined;
let cachedList: Chantier[] = EMPTY;

// Normalise les données anciennes : typeSupport était un string, maintenant c'est un tableau.
function normalize(c: Chantier): Chantier {
  return {
    ...c,
    typeSupport: Array.isArray(c.typeSupport) ? c.typeSupport : [c.typeSupport],
  };
}

function load(): Chantier[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Chantier[]).map(normalize) : [];
  } catch {
    return [];
  }
}

function save(list: Chantier[]): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(list);
    window.localStorage.setItem(KEY, serialized);
    cachedRaw = serialized;
    cachedList = list.map(normalize);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // private mode / quota — silent fail
  }
}

export function subscribeChantiers(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function getChantiersSnapshot(): Chantier[] {
  if (typeof window === "undefined") return EMPTY;

  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw && cachedRaw !== undefined) {
      return cachedList;
    }

    cachedRaw = raw;
    cachedList = raw ? (JSON.parse(raw) as Chantier[]).map(normalize) : EMPTY;
    return cachedList;
  } catch {
    cachedRaw = null;
    cachedList = EMPTY;
    return cachedList;
  }
}

export function getChantiersServerSnapshot(): Chantier[] {
  return EMPTY;
}

export function loadChantiers(): Chantier[] {
  return getChantiersSnapshot();
}

export function addChantier(
  data: Omit<Chantier, "id" | "createdAt">,
): Chantier {
  const list = load();
  const entry: Chantier = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  save([...list, entry]);
  return entry;
}

export function updateChantier(
  id: string,
  data: Omit<Chantier, "id" | "createdAt">,
): void {
  const list = load();
  save(list.map((c) => (c.id === id ? { ...c, ...data } : c)));
}

export function deleteChantier(id: string): void {
  save(load().filter((c) => c.id !== id));
}
