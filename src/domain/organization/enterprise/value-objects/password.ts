import bcrypt from "bcryptjs";
import z from "zod";
import { ValidationError } from "@/core/errors/validation-error";

export class Password {
  private constructor(public readonly hash: string) {}

  private static async encryptPassword(password: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  }

  public static validate(password: string) {
    // set as max as per bcrypts docs: `The maximum input length is 72 bytes` (https://www.npmjs.com/package/bcryptjs)
    const PasswordSchema = z
      .string()
      .min(8)
      .max(72)
      .refine((val) => (val.match(/[A-Z]/g) || []).length >= 1, {
        message: "Must contain at least 1 uppercase letters",
      });

    const result = PasswordSchema.safeParse(password);

    if (!result.success) {
      throw new ValidationError({ cause: result.error.message });
    }
  }

  static async create(password: string) {
    Password.validate(password);

    const hash = await Password.encryptPassword(password);

    return new Password(hash);
  }
}
