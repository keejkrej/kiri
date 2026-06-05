import * as React from 'react';

import {cn} from '@/lib/utils';

export function Empty({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className,
      )}
      {...props}
    />
  );
}

export function EmptyHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex flex-col items-center gap-3', className)}
      {...props}
    />
  );
}

export function EmptyMedia({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        'flex size-14 items-center justify-center rounded-full border border-border bg-secondary text-accent',
        className,
      )}
      {...props}
    />
  );
}

export function EmptyTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="empty-title"
      className={cn(
        'font-[family-name:var(--font-display)] text-lg font-semibold',
        className,
      )}
      {...props}
    />
  );
}

export function EmptyDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="empty-description"
      className={cn('max-w-sm text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function EmptyContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-content"
      className={cn('flex flex-col items-center gap-3', className)}
      {...props}
    />
  );
}
