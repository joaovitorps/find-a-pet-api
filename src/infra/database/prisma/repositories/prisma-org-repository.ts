import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import type { Org, PrismaClient } from "@/generated/prisma/client";
import { toDb, toDomain } from "@/infra/mappers/org-mapper";
import { prisma } from "@/lib/prisma";

export class PrismaOrgRepository implements OrgRepository {
  orgs: Org[] = [];

  constructor(private db: PrismaClient = prisma) {}

  async findById(id: string) {
    const org = await this.db.org.findFirst({
      where: { id },
    });

    if (!org) {
      return null;
    }

    return toDomain(org);
  }

  async findByEmail(email: string) {
    const org = await this.db.org.findFirst({
      where: { email },
    });

    if (!org) {
      return null;
    }

    return toDomain(org);
  }

  async create(data: Organization): Promise<void> {
    await this.db.org.create({ data: toDb(data) });
  }
}
