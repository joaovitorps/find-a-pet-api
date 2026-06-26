import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";
import type { Organization } from "../../enterprise/entities/organization";

export interface OrgRepository {
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  create(data: OrgUncheckedCreateInput): Promise<void>;
}
