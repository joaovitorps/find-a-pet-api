import { InvalidPhoneError } from "@/core/errors/invalid-phone-error";

export class Phone {
  public readonly number: string;

  constructor({ number }: { number: string }) {
    if (!Phone.isValidPhone(number)) throw new InvalidPhoneError();

    this.number = number;
  }

  private static isValidPhone(number: string) {
    const regex = /^\+55[1-9]{2}(?:[2-8]\d{7}|9\d{8})$/;

    return regex.test(number);
  }

  static create(number: string) {
    return new Phone({ number });
  }
}
