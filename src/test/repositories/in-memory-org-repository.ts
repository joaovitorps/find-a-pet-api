import { randomUUID } from "node:crypto";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Org } from "@/generated/prisma/client";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";

export class InMemoryOrgRepository implements OrgRepository {
  orgs: Org[] = [];

  async findByNameAndPhone(name: string, phone: string) {
    const org = this.orgs.find(
      (org) => org.name === name && org.phone === phone,
    );

    if (!org) {
      return null;
    }

    return org;
  }

  async create(data: OrgUncheckedCreateInput) {
    const org: Org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    this.orgs.push(org);
  }
}
