import AsyncStorage from '@react-native-async-storage/async-storage';

import type {Repository} from '../types/repository';

const REPO_INDEX_KEY = 'kiri:repo-index';
const repoKey = (id: string) => `kiri:repo:${id}`;

export async function persistRepository(repo: Repository): Promise<void> {
  await AsyncStorage.setItem(repoKey(repo.id), JSON.stringify(repo));
  const index = await loadRepositoryIndex();
  if (!index.includes(repo.id)) {
    index.push(repo.id);
    await AsyncStorage.setItem(REPO_INDEX_KEY, JSON.stringify(index));
  }
}

export async function loadPersistedRepositories(): Promise<Repository[]> {
  const index = await loadRepositoryIndex();
  const repos: Repository[] = [];

  for (const id of index) {
    const raw = await AsyncStorage.getItem(repoKey(id));
    if (!raw) {
      continue;
    }
    try {
      repos.push(JSON.parse(raw) as Repository);
    } catch {
      await AsyncStorage.removeItem(repoKey(id));
    }
  }

  return repos;
}

async function loadRepositoryIndex(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(REPO_INDEX_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}
