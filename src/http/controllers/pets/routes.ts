import type { FastifyInstance } from "fastify";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { verifyJWT } from "@/http/middlewares/jwt";
import { createPetController } from "./create-pet";
import { detailsController } from "./details";
import { fetchPetController } from "./fetch-pet";
import { publishPetController } from "./publish-pet";

export const petRoutes = (
  app: FastifyInstance,
  opts: { orgRepository: OrgRepository; petRepository: PetRepository },
) => {
  app.get(`/pets`, fetchPetController(opts.petRepository));
  app.get(`/pets/:petId`, detailsController(opts.petRepository));

  app.post(
    `/organizations/:orgId/pets`,
    { onRequest: verifyJWT },
    createPetController(opts.orgRepository, opts.petRepository),
  );
  app.patch(
    `/pets/:petId/publish`,
    { onRequest: verifyJWT },
    publishPetController(opts.orgRepository, opts.petRepository),
  );
};
