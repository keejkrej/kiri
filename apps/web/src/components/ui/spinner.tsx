import {Loader2Icon} from 'lucide-react';

import {cn} from '@/lib/utils';

export function Spinner({className}: {className?: string}) {
  return (
    <Loader2Icon
      data-slot="spinner"
      className={cn('animate-spin text-primary', className)}
      aria-hidden
    />
  );
}
