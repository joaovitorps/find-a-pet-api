import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Org, PrismaClient } from "@/generated/prisma/client";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";

export class PrismaOrgRepository implements OrgRepository {
  orgs: Org[] = [];

  constructor(private db: PrismaClient = prisma) {}

  async findByNameAndPhone(name: string, phone: string) {
    return await this.db.org.findFirst({
      where: { name, phone },
    });
  }

  async create(data: OrgUncheckedCreateInput): Promise<void> {
    await this.db.org.create({ data });
  }
}
