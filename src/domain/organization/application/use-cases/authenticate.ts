import bcrypt from "bcryptjs";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Org } from "@/generated/prisma/client";

export interface AuthenticateUseCaseParams {
  email: string;
  password: string;
}

export interface AuthenticateUseCaseReturn {
  org: Org;
}

export class AuthenticateUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({ email, password }: AuthenticateUseCaseParams) {
    const org = await this.orgRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await bcrypt.compare(password, org.password);

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    return { org };
  }
}
