import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {
  cloneRepository,
  RepositoryLimitError,
} from '../services/repositoryService';
import {loadPersistedRepositories} from '../services/repositoryPersistence';
import type {CloneStatus, Repository} from '../types/repository';

type State = {
  repositories: Repository[];
  activeRepoId: string | null;
  activeFilePath: string | null;
  cloneStatus: CloneStatus;
  cloneError: string | null;
  isHydrated: boolean;
};

type Action =
  | {type: 'HYDRATE'; repositories: Repository[]}
  | {type: 'ADD_REPOSITORY'; repository: Repository}
  | {type: 'SET_ACTIVE_REPO'; repoId: string | null}
  | {type: 'SET_ACTIVE_FILE'; filePath: string | null}
  | {type: 'SET_CLONE_STATUS'; status: CloneStatus; error?: string | null};

const initialState: State = {
  repositories: [],
  activeRepoId: null,
  activeFilePath: null,
  cloneStatus: 'idle',
  cloneError: null,
  isHydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        repositories: action.repositories,
        activeRepoId: action.repositories[0]?.id ?? null,
        isHydrated: true,
      };
    case 'ADD_REPOSITORY':
      return {
        ...state,
        repositories: [...state.repositories, action.repository],
        activeRepoId: action.repository.id,
        activeFilePath: null,
        cloneStatus: 'idle',
        cloneError: null,
      };
    case 'SET_ACTIVE_REPO':
      return {
        ...state,
        activeRepoId: action.repoId,
        activeFilePath: null,
      };
    case 'SET_ACTIVE_FILE':
      return {
        ...state,
        activeFilePath: action.filePath,
      };
    case 'SET_CLONE_STATUS':
      return {
        ...state,
        cloneStatus: action.status,
        cloneError: action.error ?? null,
      };
    default:
      return state;
  }
}

type RepositoryContextValue = {
  state: State;
  activeRepository: Repository | null;
  activeFileContent: string | null;
  selectRepository: (repoId: string) => void;
  selectFile: (filePath: string) => void;
  cloneRepo: (url: string) => Promise<void>;
};

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export function RepositoryProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    loadPersistedRepositories()
      .then((repositories) => {
        if (!cancelled) {
          dispatch({type: 'HYDRATE', repositories});
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({type: 'HYDRATE', repositories: []});
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeRepository = useMemo(
    () =>
      state.repositories.find((repo) => repo.id === state.activeRepoId) ?? null,
    [state.repositories, state.activeRepoId],
  );

  const activeFileContent = useMemo(() => {
    if (!activeRepository || !state.activeFilePath) {
      return null;
    }
    return activeRepository.files[state.activeFilePath] ?? null;
  }, [activeRepository, state.activeFilePath]);

  const selectRepository = useCallback((repoId: string) => {
    dispatch({type: 'SET_ACTIVE_REPO', repoId});
  }, []);

  const selectFile = useCallback((filePath: string) => {
    dispatch({type: 'SET_ACTIVE_FILE', filePath});
  }, []);

  const cloneRepo = useCallback(async (url: string) => {
    dispatch({type: 'SET_CLONE_STATUS', status: 'cloning', error: null});
    try {
      const repository = await cloneRepository(url);
      dispatch({type: 'SET_CLONE_STATUS', status: 'indexing', error: null});
      dispatch({type: 'ADD_REPOSITORY', repository});
    } catch (error) {
      const message =
        error instanceof RepositoryLimitError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to clone repository.';
      dispatch({type: 'SET_CLONE_STATUS', status: 'error', error: message});
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      activeRepository,
      activeFileContent,
      selectRepository,
      selectFile,
      cloneRepo,
    }),
    [
      state,
      activeRepository,
      activeFileContent,
      selectRepository,
      selectFile,
      cloneRepo,
    ],
  );

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository(): RepositoryContextValue {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepository must be used within RepositoryProvider');
  }
  return context;
}
