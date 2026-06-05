import {Data} from 'effect';

export class RepositoryLimitError extends Data.TaggedError(
  'RepositoryLimitError',
)<{
  readonly message: string;
}> {}

export class CloneError extends Data.TaggedError('CloneError')<{
  readonly message: string;
}> {}
