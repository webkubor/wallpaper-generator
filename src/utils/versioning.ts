export type Release = {
  version: string;
  date?: string;
  changes: string[];
};

export type VersionInfo = {
  latest: string;
  releases: Release[];
};

const VERSION_URL = `${import.meta.env.BASE_URL}version.json`;

const normalizeRelease = (release: unknown): Release | null => {
  if (!release || typeof release !== 'object') return null;
  const record = release as {
    version?: unknown;
    date?: unknown;
    changes?: unknown;
  };

  if (typeof record.version !== 'string') return null;

  const changes = Array.isArray(record.changes)
    ? record.changes.filter((item): item is string => typeof item === 'string')
    : [];

  const date = typeof record.date === 'string' ? record.date : undefined;

  return {
    version: record.version,
    date,
    changes,
  };
};

export const fetchVersionInfo = async (): Promise<VersionInfo | null> => {
  try {
    const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const raw = await response.json();
    const releases = Array.isArray(raw?.releases)
      ? raw.releases.map(normalizeRelease).filter((item): item is Release => Boolean(item))
      : [];
    const latest = typeof raw?.latest === 'string' ? raw.latest : releases[0]?.version;

    if (!latest || !releases.length) return null;

    return { latest, releases };
  } catch {
    return null;
  }
};

export const selectUpdateReleases = (info: VersionInfo, currentVersion: string): Release[] => {
  if (!info.releases.length) return [];
  const index = info.releases.findIndex((release) => release.version === currentVersion);
  if (index === -1) return [info.releases[0]];
  return info.releases.slice(0, index);
};
