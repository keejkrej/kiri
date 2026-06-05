import LightningFS from '@isomorphic-git/lightning-fs';

import {MemoryFsBackend} from './memoryFsBackend';

type LightningFsInstance = InstanceType<typeof LightningFS>;

const fsCache = new Map<string, LightningFsInstance>();

export function getRepoFs(repoId: string): LightningFsInstance {
  let fs = fsCache.get(repoId);
  if (!fs) {
    fs = new LightningFS(`kiri-repo-${repoId}`, {
      backend: new MemoryFsBackend(),
    } as Record<string, unknown>);
    fsCache.set(repoId, fs);
  }
  return fs;
}

export function removeRepoFs(repoId: string): void {
  fsCache.delete(repoId);
}

export function getRepoPromisesFs(repoId: string) {
  return getRepoFs(repoId).promises;
}
