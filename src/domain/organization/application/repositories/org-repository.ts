import type { Organization } from "../../enterprise/entities/organization";

export interface OrgRepository {
  create(data: Organization): Promise<void>;
}
