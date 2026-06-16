import { InvalidPhoneError } from "@/core/errors/invalid-phone-error";

export class Phone {
  public readonly number: string;
  public static readonly validationRegex: RegExp =
    /^\+55[1-9]{2}(?:[2-8]\d{7}|9\d{8})$/;

  constructor({ number }: { number: string }) {
    if (!this.isValidPhone(number)) throw new InvalidPhoneError();

    this.number = number;
  }

  private isValidPhone(number: string) {
    return Phone.validationRegex.test(number);
  }

  static create(number: string) {
    return new Phone({ number });
  }
}
