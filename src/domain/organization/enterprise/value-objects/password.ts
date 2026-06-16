import bcrypt from "bcryptjs";

export class Password {
  constructor(public readonly hash: string) {}

  private static async encryptPassword(password: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  }

  public async checkPasswordMatch(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
  }

  static async create({ password }: { password: string }) {
    const hash = await Password.encryptPassword(password);

    return new Password(hash);
  }
}
