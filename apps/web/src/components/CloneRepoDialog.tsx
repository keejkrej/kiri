import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '@/components/ui/dialog';
import {Field, FieldDescription, FieldGroup, FieldLabel} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {Spinner} from '@/components/ui/spinner';
import {useWorkspace} from '@/hooks/useWorkspace';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CloneRepoDialog({open, onOpenChange}: Props) {
  const {state, cloneRepo} = useWorkspace();
  const [url, setUrl] = useState('');

  const isBusy =
    state.cloneStatus === 'cloning' || state.cloneStatus === 'indexing';

  const statusLabel =
    state.cloneStatus === 'cloning'
      ? 'Cloning repository…'
      : state.cloneStatus === 'indexing'
        ? 'Indexing files…'
        : null;

  const handleClone = async () => {
    try {
      await cloneRepo(url);
      setUrl('');
      onOpenChange(false);
    } catch {
      // Error surfaced via workspace state.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="relative">
        <DialogHeader>
          <DialogTitle>Clone repository</DialogTitle>
          <DialogDescription>
            Enter a public git URL. Files are stored in virtual sandbox storage.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <FieldGroup>
            <Field data-invalid={state.cloneError ? true : undefined}>
              <FieldLabel htmlFor="clone-url">Repository URL</FieldLabel>
              <Input
                id="clone-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/org/repo.git"
                autoCapitalize="off"
                autoCorrect="off"
                disabled={isBusy}
                aria-invalid={state.cloneError ? true : undefined}
              />
              {state.cloneError ? (
                <FieldDescription className="text-destructive">
                  {state.cloneError}
                </FieldDescription>
              ) : null}
            </Field>
            {statusLabel ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner />
                <span>{statusLabel}</span>
              </div>
            ) : null}
          </FieldGroup>
        </DialogPanel>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isBusy} />}
          >
            Cancel
          </DialogClose>
          <Button
            onClick={handleClone}
            disabled={isBusy || url.trim().length === 0}
          >
            {isBusy ? <Spinner /> : null}
            Clone
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
