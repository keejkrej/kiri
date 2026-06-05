import {Schema} from '@effect/schema';

export const CloneStatus = Schema.Literal(
  'idle',
  'cloning',
  'indexing',
  'error',
);
export type CloneStatus = typeof CloneStatus.Type;

export type FileTreeNode = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
};

export const Repository = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  cloneUrl: Schema.String,
  virtualRoot: Schema.String,
  files: Schema.Record({key: Schema.String, value: Schema.String}),
});
export type Repository = typeof Repository.Type;

export const MAX_FILE_BYTES = 512 * 1024;
export const MAX_FILE_COUNT = 2000;
