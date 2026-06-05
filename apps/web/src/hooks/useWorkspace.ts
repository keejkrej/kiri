import {useAtomSet, useAtomValue} from '@effect-atom/atom-react';
import {RepositoryLimitError} from '@kiri/domain';
import {useCallback} from 'react';

import {
  activeFileContentAtom,
  activeRepositoryAtom,
  workspaceAtom,
} from '@/atoms/repositoryAtoms';
import {loadPersistedRepositories} from '@/services/persistence';
import {cloneRepository} from '@/services/repositoryService';

export function useWorkspace() {
  const state = useAtomValue(workspaceAtom);
  const setState = useAtomSet(workspaceAtom);
  const activeRepository = useAtomValue(activeRepositoryAtom);
  const activeFileContent = useAtomValue(activeFileContentAtom);

  const hydrate = useCallback(async () => {
    const repositories = await loadPersistedRepositories();
    setState({
      repositories,
      activeRepoId: repositories[0]?.id ?? null,
      activeFilePath: null,
      cloneStatus: 'idle',
      cloneError: null,
      isHydrated: true,
    });
  }, [setState]);

  const selectRepository = useCallback(
    (repoId: string) => {
      setState((current) => ({
        ...current,
        activeRepoId: repoId,
        activeFilePath: null,
      }));
    },
    [setState],
  );

  const selectFile = useCallback(
    (filePath: string) => {
      setState((current) => ({
        ...current,
        activeFilePath: filePath,
      }));
    },
    [setState],
  );

  const cloneRepo = useCallback(
    async (url: string) => {
      setState((current) => ({
        ...current,
        cloneStatus: 'cloning',
        cloneError: null,
      }));

      try {
        const repository = await cloneRepository(url);
        setState((current) => ({
          ...current,
          repositories: [...current.repositories, repository],
          activeRepoId: repository.id,
          activeFilePath: null,
          cloneStatus: 'idle',
          cloneError: null,
        }));
      } catch (error) {
        const message =
          error instanceof RepositoryLimitError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Failed to clone repository.';
        setState((current) => ({
          ...current,
          cloneStatus: 'error',
          cloneError: message,
        }));
        throw error;
      }
    },
    [setState],
  );

  return {
    state,
    activeRepository,
    activeFileContent,
    hydrate,
    selectRepository,
    selectFile,
    cloneRepo,
  };
}
