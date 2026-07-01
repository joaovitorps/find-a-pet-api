import { fastifyCookie } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { type FastifyServerOptions, fastify } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "./core/errors/invalid-credentials";
import { ResourceAlreadyExistsError } from "./core/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "./core/errors/resource-not-found";
import { ValidationError } from "./core/errors/validation-error";
import type { OrgRepository } from "./domain/organization/application/repositories/org-repository";
import type { PetRepository } from "./domain/pet/application/repositories/pet-repository";
import { env } from "./env";
import { healthRoutes } from "./http/controllers/health/routes";
import { organizationRoutes } from "./http/controllers/organizations/routes";
import { petRoutes } from "./http/controllers/pets/routes";
import { PrismaOrgRepository } from "./infra/database/prisma/repositories/prisma-org-repository";
import { PrismaPetRepository } from "./infra/database/prisma/repositories/prisma-pet-repository";

export function build(
  opts: FastifyServerOptions = {},
  deps?: {
    orgRepository?: OrgRepository;
    petRepository?: PetRepository;
  },
) {
  const app = fastify(opts);

  app.register(fastifyCors, {
    origin: env.WEB_DOMAIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  });

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof z.ZodError || error instanceof ValidationError) {
      return reply.status(400).send({
        issues: error.message,
        cause: "issues" in error ? error.issues : error.cause,
      });
    }

    if (error instanceof InvalidCredentialsError) {
      return reply.code(401).send(new Error(error.message));
    }

    if (error instanceof ResourceAlreadyExistsError) {
      return reply.code(409).send();
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.code(404).send();
    }

    app.log.error(error);

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
  const petRepository = deps?.petRepository ?? new PrismaPetRepository();

  app.register(organizationRoutes, { orgRepository });
  app.register(petRoutes, { orgRepository, petRepository });
  app.register(healthRoutes);

  return app;
}
