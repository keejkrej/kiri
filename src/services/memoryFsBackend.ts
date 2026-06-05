import {Buffer} from 'buffer';

type StatLike = {
  type: 'file' | 'dir' | 'symlink';
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
};

type DirectoryNode = {
  type: 'dir';
  children: Map<string, FsNode>;
  mode: number;
  mtimeMs: number;
  ctimeMs: number;
  ino: number;
};

type FileNode = {
  type: 'file';
  data: Uint8Array;
  mode: number;
  mtimeMs: number;
  ctimeMs: number;
  ino: number;
};

type FsNode = DirectoryNode | FileNode;

function makeError(code: string, message: string): Error & {code: string} {
  const error = new Error(message) as Error & {code: string};
  error.code = code;
  return error;
}

function normalizePath(filepath: string): string {
  const parts = filepath.split('/').filter(Boolean);
  return `/${parts.join('/')}`;
}

export class MemoryFsBackend {
  private root: DirectoryNode;
  private inode = 1;

  constructor() {
    this.root = this.createDir();
  }

  async init(): Promise<void> {}

  async activate(): Promise<void> {}

  async deactivate(): Promise<void> {}

  saveSuperblock(): void {}

  async readFile(
    filepath: string,
    opts?: {encoding?: 'utf8'},
  ): Promise<Uint8Array | string> {
    const node = this.getNode(filepath);
    if (node.type !== 'file') {
      throw makeError('EISDIR', 'Is a directory');
    }
    if (opts?.encoding === 'utf8') {
      return Buffer.from(node.data).toString('utf8');
    }
    return node.data;
  }

  async writeFile(filepath: string, data: Uint8Array | string): Promise<void> {
    const normalized = normalizePath(filepath);
    const {parent, name} = this.resolveParent(normalized, true);
    const bytes =
      typeof data === 'string'
        ? Uint8Array.from(Buffer.from(data, 'utf8'))
        : data;
    parent.children.set(name, {
      type: 'file',
      data: bytes,
      mode: 0o644,
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
      ino: ++this.inode,
    });
  }

  async unlink(filepath: string): Promise<void> {
    const normalized = normalizePath(filepath);
    const {parent, name} = this.resolveParent(normalized);
    if (!parent.children.has(name)) {
      throw makeError('ENOENT', 'No such file or directory');
    }
    parent.children.delete(name);
  }

  async readdir(filepath: string): Promise<string[]> {
    const node = this.getNode(filepath);
    if (node.type !== 'dir') {
      throw makeError('ENOTDIR', 'Not a directory');
    }
    return [...node.children.keys()].sort();
  }

  async mkdir(filepath: string): Promise<void> {
    const normalized = normalizePath(filepath);
    const {parent, name} = this.resolveParent(normalized, true);
    if (parent.children.has(name)) {
      throw makeError('EEXIST', 'File exists');
    }
    parent.children.set(name, this.createDir());
  }

  async rmdir(filepath: string): Promise<void> {
    const node = this.getNode(filepath);
    if (node.type !== 'dir') {
      throw makeError('ENOTDIR', 'Not a directory');
    }
    if (node.children.size > 0) {
      throw makeError('ENOTEMPTY', 'Directory not empty');
    }
    const {parent, name} = this.resolveParent(normalizePath(filepath));
    parent.children.delete(name);
  }

  async stat(filepath: string): Promise<StatLike> {
    return this.toStat(this.getNode(filepath));
  }

  async lstat(filepath: string): Promise<StatLike> {
    return this.stat(filepath);
  }

  private createDir(): DirectoryNode {
    return {
      type: 'dir',
      children: new Map(),
      mode: 0o755,
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
      ino: ++this.inode,
    };
  }

  private getNode(filepath: string): FsNode {
    const normalized = normalizePath(filepath);
    if (normalized === '/') {
      return this.root;
    }

    const parts = normalized.split('/').filter(Boolean);
    let current: FsNode = this.root;

    for (const part of parts) {
      if (current.type !== 'dir' || !current.children.has(part)) {
        throw makeError('ENOENT', 'No such file or directory');
      }
      current = current.children.get(part)!;
    }

    return current;
  }

  private resolveParent(filepath: string, createMissing = false) {
    const normalized = normalizePath(filepath);
    const parts = normalized.split('/').filter(Boolean);
    const name = parts.pop();
    if (!name) {
      throw makeError('ENOENT', 'Invalid path');
    }

    let current = this.root;
    for (const part of parts) {
      const child = current.children.get(part);
      if (!child) {
        if (!createMissing) {
          throw makeError('ENOENT', 'No such file or directory');
        }
        const created = this.createDir();
        current.children.set(part, created);
        current = created;
        continue;
      }
      if (child.type !== 'dir') {
        throw makeError('ENOTDIR', 'Not a directory');
      }
      current = child;
    }

    return {parent: current, name};
  }

  private toStat(node: FsNode): StatLike {
    return {
      type: node.type,
      mode: node.mode,
      size: node.type === 'file' ? node.data.byteLength : 0,
      ino: node.ino,
      mtimeMs: node.mtimeMs,
      ctimeMs: node.ctimeMs,
    };
  }
}
