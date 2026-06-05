export interface Repository {
  id: string;
  name: string;
  cloneUrl: string;
  virtualRoot: string;
  files: Record<string, string>;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

export type CloneStatus = 'idle' | 'cloning' | 'indexing' | 'error';

export const MAX_FILE_BYTES = 512 * 1024;
export const MAX_FILE_COUNT = 2000;
