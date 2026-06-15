import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";

export class InMemoryOrgRepository implements OrgRepository {
  orgs: Organization[] = [];

  async create(data: Organization): Promise<void> {
    this.orgs.push(data);
  }
}
