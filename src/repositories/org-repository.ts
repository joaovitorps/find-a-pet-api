import type { Org } from "@/generated/prisma/client";
import type { OrgCreateInput } from "@/generated/prisma/models";

export interface OrgRepository {
  create(data: OrgCreateInput): Promise<Org>;
}
