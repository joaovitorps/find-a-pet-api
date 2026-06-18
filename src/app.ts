import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { type FastifyServerOptions, fastify } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "./core/errors/invalid-credentials";
import { ResourceAlreadyExistsError } from "./core/errors/resource-already-exists-error";
import type { OrgRepository } from "./domain/organization/application/repositories/org-repository";
import { env } from "./env";
import { organizationRoutes } from "./http/controllers/organizations/routes";
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

    if (error instanceof InvalidCredentialsError) {
      return reply.code(401).send(error.message);
    }

    if (error instanceof ResourceAlreadyExistsError) {
      return reply.code(409).send();
    }

    console.error(error);

    return reply.status(500).send(new Error("Unexpected error happened."));
  });

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: "10m",
    },
  });

  app.register(fastifyCookie);

  const orgRepository = deps?.orgRepository ?? new PrismaOrgRepository();

  app.register(organizationRoutes, { orgRepository });

  return app;
}
