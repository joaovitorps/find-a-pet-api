export class InvalidPhoneError extends Error {
  constructor() {
    super("Invalid phone number.");
  }
}
