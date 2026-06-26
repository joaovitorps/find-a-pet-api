export class ValidationError extends Error {
  constructor({ cause }: { cause: string }) {
    super(cause);
  }
}
