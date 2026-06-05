import {ChevronRightIcon, FileIcon, FolderIcon} from 'lucide-react';
import {useState} from 'react';

import type {FileTreeNode} from '@kiri/domain';

import {cn} from '@/lib/utils';

type Props = {
  node: FileTreeNode;
  depth: number;
  onSelectFile: (path: string) => void;
};

export function FileTreeRow({node, depth, onSelectFile}: Props) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === 'file') {
    return (
      <button
        type="button"
        className={cn(
          'flex w-full min-h-10 items-center gap-2 border-b border-border/50 px-3 text-left text-sm transition-colors hover:bg-secondary/60',
        )}
        style={{paddingLeft: `${12 + depth * 14}px`}}
        onClick={() => onSelectFile(node.path)}
      >
        <FileIcon className="ml-3 size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-[family-name:var(--font-mono)] text-[13px]">
          {node.name}
        </span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full min-h-10 items-center gap-2 border-b border-border/50 px-3 text-left text-sm transition-colors hover:bg-secondary/60"
        style={{paddingLeft: `${12 + depth * 14}px`}}
        onClick={() => setExpanded((value) => !value)}
      >
        <ChevronRightIcon
          className={cn(
            'size-3 shrink-0 text-muted-foreground transition-transform',
            expanded && 'rotate-90',
          )}
        />
        <FolderIcon className="size-3.5 shrink-0 text-accent" />
        <span className="truncate">{node.name}</span>
      </button>
      {expanded
        ? node.children?.map((child) => (
            <FileTreeRow
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelectFile={onSelectFile}
            />
          ))
        : null}
    </div>
  );
}
