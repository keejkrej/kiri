import LightningFS from '@isomorphic-git/lightning-fs';
import {
  createRepoId,
  MAX_FILE_BYTES,
  MAX_FILE_COUNT,
  parseRepoName,
  RepositoryLimitError,
  type Repository,
} from '@kiri/domain';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';

import {persistRepository} from './persistence';

const fsCache = new Map<string, InstanceType<typeof LightningFS>>();

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.turbo',
  'Pods',
  'DerivedData',
]);

const SKIP_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'ico',
  'pdf',
  'zip',
  'gz',
  'tar',
  'wasm',
  'exe',
  'dll',
  'so',
  'dylib',
  'mp3',
  'mp4',
  'woff',
  'woff2',
  'ttf',
  'eot',
]);

function getRepoPromisesFs(repoId: string) {
  let fs = fsCache.get(repoId);
  if (!fs) {
    fs = new LightningFS(`kiri-repo-${repoId}`);
    fsCache.set(repoId, fs);
  }
  return fs.promises;
}

export async function cloneRepository(url: string): Promise<Repository> {
  const cloneUrl = url.trim();
  if (!cloneUrl) {
    throw new Error('Repository URL is required.');
  }

  const name = parseRepoName(cloneUrl);
  const id = createRepoId(name);
  const virtualRoot = `/repos/${id}`;
  const pfs = getRepoPromisesFs(id);

  await git.clone({
    fs: pfs,
    http,
    dir: virtualRoot,
    url: cloneUrl,
    singleBranch: true,
    depth: 1,
  });

  const files = await indexRepository(pfs, virtualRoot);
  const repo: Repository = {
    id,
    name,
    cloneUrl,
    virtualRoot,
    files,
  };

  await persistRepository(repo);
  return repo;
}

async function indexRepository(
  pfs: ReturnType<typeof getRepoPromisesFs>,
  dir: string,
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  let fileCount = 0;

  async function walk(
    currentDir: string,
    relativePrefix: string,
  ): Promise<void> {
    const entries = await pfs.readdir(currentDir);

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry)) {
        continue;
      }

      const absolutePath = `${currentDir}/${entry}`;
      const relativePath = relativePrefix
        ? `${relativePrefix}/${entry}`
        : entry;
      const stat = await pfs.stat(absolutePath);

      if (stat.isDirectory()) {
        await walk(absolutePath, relativePath);
        continue;
      }

      if (!stat.isFile()) {
        continue;
      }

      const ext = entry.split('.').pop()?.toLowerCase() ?? '';
      if (SKIP_EXTENSIONS.has(ext)) {
        continue;
      }

      if (stat.size > MAX_FILE_BYTES) {
        continue;
      }

      if (fileCount >= MAX_FILE_COUNT) {
        throw new RepositoryLimitError({
          message: `Repository exceeds the MVP limit of ${MAX_FILE_COUNT} indexed files.`,
        });
      }

      const buffer = await pfs.readFile(absolutePath);
      const content = new TextDecoder().decode(
        buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer),
      );
      if (content.includes('\u0000')) {
        continue;
      }

      files[relativePath] = content;
      fileCount += 1;
    }
  }

  await walk(dir, '');
  return files;
}
