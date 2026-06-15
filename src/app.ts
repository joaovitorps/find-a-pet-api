import fastify, { type FastifyServerOptions } from "fastify";
import { z } from "zod";
import type { OrgRepository } from "./domain/organization/application/repositories/org-repository";
import { organizationRoutes } from "./http/controllers/routes";
import { PrismaOrgRepository } from "./infra/database/prisma/repositories/prisma-org-repository";

export function build(
  opts: FastifyServerOptions = {},
  deps?: {
    orgRepository?: OrgRepository;
  },
) {
  const app = fastify(opts);

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ issues: error.issues });
    }

    console.error(error);

    return reply.status(500).send(new Error("Unexpected error happened."));
  });

  const orgRepository = deps?.orgRepository ?? new PrismaOrgRepository();

  app.register(organizationRoutes, { orgRepository });

  return app;
}
