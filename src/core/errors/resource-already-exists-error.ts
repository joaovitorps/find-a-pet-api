export class ResourceAlreadyExists extends Error {
  constructor() {
    super("Resource already exists");
  }
}
