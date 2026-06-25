import { randomUUID } from "node:crypto";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import type { Org } from "@/generated/prisma/client";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";

export class InMemoryOrgRepository implements OrgRepository {
  orgs: Organization[] = [];

  async findById(id: string) {
    const org = this.orgs.find((org) => org.id.toString() === id);

    if (!org) {
      return null;
    }

    return org;
  }

  async findByEmail(email: string) {
    const org = this.orgs.find((org) => org.email === email);

    if (!org) {
      return null;
    }

    return org;
  }

  async fetchByCity(city: string) {
    return this.orgs.filter((org) => org.address.city === city);
  }

  async create(data: OrgUncheckedCreateInput) {
    const org: Org = {
      id: data.id ?? randomUUID(),
      email: data.email,
      password: data.password,
      ownerName: data.ownerName,
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    this.orgs.push(org);
  }
}
