import {languageFromPath} from '@kiri/domain';
import {LockIcon, MapIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {codeToHtml} from 'shiki';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {Spinner} from '@/components/ui/spinner';
import {useWorkspace} from '@/hooks/useWorkspace';

export function CodeCanvas() {
  const {activeRepository, activeFileContent, state} = useWorkspace();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasFile =
    !!state.activeFilePath && activeFileContent != null && !!activeRepository;

  useEffect(() => {
    if (!hasFile || !state.activeFilePath || activeFileContent == null) {
      setHtml(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    codeToHtml(activeFileContent, {
      lang: languageFromPath(state.activeFilePath),
      theme: 'github-dark',
    })
      .then((result) => {
        if (!cancelled) {
          setHtml(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHtml(
            `<pre class="shiki-fallback"><code>${escapeHtml(activeFileContent)}</code></pre>`,
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeFileContent, hasFile, state.activeFilePath]);

  return (
    <main className="animate-rise-delay-2 relative flex min-w-0 flex-1 flex-col bg-background">
      <header className="flex min-h-12 items-center gap-3 border-b border-border px-5">
        <LockIcon className="size-3.5 text-primary" />
        <p className="truncate font-[family-name:var(--font-mono)] text-sm font-medium">
          {hasFile ? state.activeFilePath : 'Immutable code canvas'}
        </p>
      </header>

      {hasFile ? (
        <div className="relative flex-1 overflow-auto">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </div>
          ) : null}
          {html ? (
            <div
              className="shiki-canvas px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed [&_.shiki]:!bg-transparent [&_pre]:m-0"
              dangerouslySetInnerHTML={{__html: html}}
            />
          ) : null}
        </div>
      ) : (
        <Empty className="flex-1">
          <EmptyHeader>
            <EmptyMedia>
              <MapIcon />
            </EmptyMedia>
            <EmptyTitle>Read-only canvas</EmptyTitle>
            <EmptyDescription>
              Select a source file from the tree to view syntax-highlighted
              topography.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
