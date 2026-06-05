import type {FileTreeNode} from './schema.js';

export function parseRepoName(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '');
  const segment = trimmed.split('/').pop() ?? 'repository';
  return segment.replace(/\.git$/, '') || 'repository';
}

export function createRepoId(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${slug}-${Date.now().toString(36)}`;
}

export function buildFileTree(files: Record<string, string>): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const sortedPaths = Object.keys(files).sort((a, b) => a.localeCompare(b));

  for (const filePath of sortedPaths) {
    const parts = filePath.split('/');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join('/');

      let existing = currentLevel.find((node) => node.name === part);
      if (!existing) {
        existing = {
          name: part,
          path,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
        };
        currentLevel.push(existing);
      }

      if (!isFile) {
        existing.children ??= [];
        currentLevel = existing.children;
      }
    }
  }

  return sortTree(root);
}

function sortTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes
    .map((node) =>
      node.children ? {...node, children: sortTree(node.children)} : node,
    )
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}

export function repoInitials(name: string): string {
  const parts = name.split(/[-_]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
