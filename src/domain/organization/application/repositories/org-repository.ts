import type { Org } from "@/generated/prisma/client";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";

export interface OrgRepository {
  findByNameAndPhone(name: string, phone: string): Promise<Org | null>;
  create(data: OrgUncheckedCreateInput): Promise<void>;
}
