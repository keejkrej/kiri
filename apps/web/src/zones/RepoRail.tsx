import {PlusIcon} from 'lucide-react';

import {repoInitials} from '@kiri/domain';

import {cn} from '@/lib/utils';
import {useWorkspace} from '@/hooks/useWorkspace';

type Props = {
  onClonePress: () => void;
};

export function RepoRail({onClonePress}: Props) {
  const {state, selectRepository} = useWorkspace();

  return (
    <aside className="animate-rise flex w-[72px] shrink-0 flex-col items-center gap-3 border-r border-border bg-card py-4">
      <div className="mb-1 flex h-16 items-center justify-center">
        <span
          className="font-[family-name:var(--font-display)] text-[10px] font-bold tracking-[0.35em] text-secondary-foreground"
          style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}
        >
          KIRI
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center gap-2.5 overflow-y-auto px-2">
        {state.repositories.map((repo) => {
          const isActive = repo.id === state.activeRepoId;
          return (
            <button
              key={repo.id}
              type="button"
              title={repo.name}
              onClick={() => selectRepository(repo.id)}
              className={cn(
                'flex size-12 items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'border-primary bg-primary/15 text-secondary-foreground shadow-[0_0_20px_rgb(184_115_51/0.2)]'
                  : 'border-border bg-secondary text-foreground hover:border-accent/60',
              )}
            >
              {repoInitials(repo.name)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Clone repository"
        onClick={onClonePress}
        className="flex size-12 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <PlusIcon />
      </button>
    </aside>
  );
}
