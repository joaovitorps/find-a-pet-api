import type { FastifyInstance } from "fastify";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { createOrganizationController } from "./create-organization";

export const organizationRoutes = (
  app: FastifyInstance,
  opts: { orgRepository: OrgRepository },
) => {
  app.post(
    "/api/organization",
    createOrganizationController(opts.orgRepository),
  );
};
