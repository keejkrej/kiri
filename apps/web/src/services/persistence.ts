import type {Repository} from '@kiri/domain';

const REPO_INDEX_KEY = 'kiri:repo-index';
const repoKey = (id: string) => `kiri:repo:${id}`;

export async function persistRepository(repo: Repository): Promise<void> {
  localStorage.setItem(repoKey(repo.id), JSON.stringify(repo));
  const index = await loadRepositoryIndex();
  if (!index.includes(repo.id)) {
    index.push(repo.id);
    localStorage.setItem(REPO_INDEX_KEY, JSON.stringify(index));
  }
}

export async function loadPersistedRepositories(): Promise<Repository[]> {
  const index = await loadRepositoryIndex();
  const repos: Repository[] = [];

  for (const id of index) {
    const raw = localStorage.getItem(repoKey(id));
    if (!raw) {
      continue;
    }
    try {
      repos.push(JSON.parse(raw) as Repository);
    } catch {
      localStorage.removeItem(repoKey(id));
    }
  }

  return repos;
}

async function loadRepositoryIndex(): Promise<string[]> {
  const raw = localStorage.getItem(REPO_INDEX_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}
