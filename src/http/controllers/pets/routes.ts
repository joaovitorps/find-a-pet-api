import type { FastifyInstance } from "fastify";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { verifyJWT } from "@/http/middlewares/jwt";
import { createPetController } from "./create-pet";

export const petRoutes = (
  app: FastifyInstance,
  opts: { orgRepository: OrgRepository; petRepository: PetRepository },
) => {
  app.addHook("onRequest", verifyJWT);

  app.post(
    `/organizations/:orgId/pets`,
    createPetController(opts.orgRepository, opts.petRepository),
  );
};
