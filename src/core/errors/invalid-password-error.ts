export class InvalidPasswordError extends Error {
  constructor({ cause }: { cause: string }) {
    super(cause);
  }
}
