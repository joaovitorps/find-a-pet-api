import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";

export class InMemoryOrgRepository implements OrgRepository {
  orgs: Organization[] = [];

  async findById(id: string): Promise<Organization | null> {
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

  async create(data: Organization) {
    this.orgs.push(data);
  }
}
