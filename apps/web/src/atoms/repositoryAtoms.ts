import {Atom} from '@effect-atom/atom-react';
import type {CloneStatus, Repository} from '@kiri/domain';

export type WorkspaceState = {
  repositories: Repository[];
  activeRepoId: string | null;
  activeFilePath: string | null;
  cloneStatus: CloneStatus;
  cloneError: string | null;
  isHydrated: boolean;
};

const initialState: WorkspaceState = {
  repositories: [],
  activeRepoId: null,
  activeFilePath: null,
  cloneStatus: 'idle',
  cloneError: null,
  isHydrated: false,
};

export const workspaceAtom = Atom.make<WorkspaceState>(initialState).pipe(
  Atom.keepAlive,
);

export const activeRepositoryAtom = Atom.map(workspaceAtom, (state) =>
  state.repositories.find((repo) => repo.id === state.activeRepoId) ?? null,
);

export const activeFileContentAtom = Atom.map(workspaceAtom, (state) => {
  const repo =
    state.repositories.find((r) => r.id === state.activeRepoId) ?? null;
  if (!repo || !state.activeFilePath) {
    return null;
  }
  return repo.files[state.activeFilePath] ?? null;
});
