import {useEffect, useState} from 'react';

import {CloneRepoDialog} from '@/components/CloneRepoDialog';
import {useWorkspace} from '@/hooks/useWorkspace';
import {CodeCanvas} from '@/zones/CodeCanvas';
import {FileTreePanel} from '@/zones/FileTreePanel';
import {RepoRail} from '@/zones/RepoRail';

export function WorkspaceLayout() {
  const {hydrate} = useWorkspace();
  const [cloneOpen, setCloneOpen] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="topo-bg flex h-full flex-col">
      <header className="flex min-h-10 items-center justify-between border-b border-border px-6">
        <div className="flex items-baseline gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.2em] text-secondary-foreground">
            KIRI
          </h1>
          <span className="text-xs text-muted-foreground">
            Repository topography
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          Read-only workspace
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        <RepoRail onClonePress={() => setCloneOpen(true)} />
        <FileTreePanel onClonePress={() => setCloneOpen(true)} />
        <CodeCanvas />
      </div>

      <CloneRepoDialog open={cloneOpen} onOpenChange={setCloneOpen} />
    </div>
  );
}
