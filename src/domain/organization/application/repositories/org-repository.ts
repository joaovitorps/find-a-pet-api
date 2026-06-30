import type { Organization } from "../../enterprise/entities/organization";

export interface OrgRepository {
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  create(data: Organization): Promise<void>;
}
