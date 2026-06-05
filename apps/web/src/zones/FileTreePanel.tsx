import {buildFileTree} from '@kiri/domain';
import {FolderTreeIcon} from 'lucide-react';
import {useMemo} from 'react';

import {FileTreeRow} from '@/components/FileTreeRow';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {Button} from '@/components/ui/button';
import {useWorkspace} from '@/hooks/useWorkspace';

type Props = {
  onClonePress: () => void;
};

export function FileTreePanel({onClonePress}: Props) {
  const {activeRepository, selectFile, state} = useWorkspace();

  const tree = useMemo(() => {
    if (!activeRepository) {
      return [];
    }
    return buildFileTree(activeRepository.files);
  }, [activeRepository]);

  return (
    <section className="animate-rise-delay-1 flex w-[280px] shrink-0 flex-col border-r border-border bg-card/50">
      <header className="border-b border-border px-4 py-3.5">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide">
          {activeRepository ? activeRepository.name : 'Topography'}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">File index</p>
      </header>

      {!state.isHydrated ? (
        <p className="p-4 text-sm text-muted-foreground">
          Loading repositories…
        </p>
      ) : !activeRepository ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <FolderTreeIcon />
            </EmptyMedia>
            <EmptyTitle>No terrain mapped</EmptyTitle>
            <EmptyDescription>
              Clone a public repository to begin surveying its file topography.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onClonePress}>Clone repository</Button>
          </EmptyContent>
        </Empty>
      ) : tree.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No indexable text files found.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {tree.map((node) => (
            <FileTreeRow
              key={node.path}
              node={node}
              depth={0}
              onSelectFile={selectFile}
            />
          ))}
        </div>
      )}
    </section>
  );
}
