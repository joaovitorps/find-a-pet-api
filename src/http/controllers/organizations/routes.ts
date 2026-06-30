import type { FastifyInstance } from "fastify";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { authenticateController } from "./authenticate";
import { createOrganizationController } from "./create-organization";

export const organizationRoutes = (
  app: FastifyInstance,
  opts: { orgRepository: OrgRepository },
) => {
  app.post("/organizations", createOrganizationController(opts.orgRepository));
  app.post("/sessions", authenticateController(opts.orgRepository));
};
