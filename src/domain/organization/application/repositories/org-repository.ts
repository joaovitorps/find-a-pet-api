import type { Org } from "@/generated/prisma/client";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";

export interface OrgRepository {
  findById(id: string): Promise<Org | null>;
  findByEmail(email: string): Promise<Org | null>;
  create(data: OrgUncheckedCreateInput): Promise<void>;
}
