import { randomUUID } from "node:crypto";
import type { Org } from "@/generated/prisma/client";
import type { OrgCreateInput } from "@/generated/prisma/models";
import type { OrgRepository } from "./org-repository";

export class InMemoryOrgRepository implements OrgRepository {
  orgs: Org[] = [];

  async create(data: OrgCreateInput): Promise<Org> {
    const orgToBeCreated = {
      id: randomUUID(),
      ...data,
    };

    this.orgs.push(orgToBeCreated);

    return orgToBeCreated;
  }
}
