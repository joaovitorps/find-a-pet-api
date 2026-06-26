import bcrypt from "bcryptjs";
import { ValidationError } from "@/core/errors/validation-error";
import { Password } from "./password";

describe("Password Value Object", async () => {
  it("should be a valid bcrypt hash", async () => {
    const pass = await Password.create("Test-pass");

    expect(pass.hash).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });

  it("should match the hash", async () => {
    const pass = await Password.create("Test-pass");

    expect(await bcrypt.compare("Test-pass", pass.hash)).toBe(true);
  });

  it("should fail if less than 8 char", async () => {
    await expect(Password.create("Test")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});
