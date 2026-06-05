import {Buffer} from 'node:buffer';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import LightningFS from '@isomorphic-git/lightning-fs';

import {MemoryFsBackend} from '../src/services/memoryFsBackend';

globalThis.Buffer = Buffer;

const repoId = 'verify-clone';
const virtualRoot = `/repos/${repoId}`;
const fs = new LightningFS(`kiri-repo-${repoId}`, {
  backend: new MemoryFsBackend(),
});
const pfs = fs.promises;

async function main() {
  console.log('Cloning sample repository into in-memory LightningFS...');
  await git.clone({
    fs: pfs,
    http,
    dir: virtualRoot,
    url: 'https://github.com/octocat/Hello-World.git',
    singleBranch: true,
    depth: 1,
  });

  const entries = await pfs.readdir(virtualRoot);
  console.log('Top-level entries:', entries);
  console.log('Clone verification succeeded.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
