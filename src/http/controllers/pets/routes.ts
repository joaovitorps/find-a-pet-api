import type { FastifyInstance } from "fastify";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { verifyJWT } from "@/http/middlewares/jwt";
import { createPetController } from "./create-pet";
import { deletePetController } from "./delete-pet";
import { detailsController } from "./details";
import { fetchPetController } from "./fetch-pet";
import { fetchPetsByOrgController } from "./fetch-pets-by-org";
import { publishPetController } from "./publish-pet";
import { updatePetController } from "./update-pet";

export const petRoutes = (
  app: FastifyInstance,
  opts: { orgRepository: OrgRepository; petRepository: PetRepository },
) => {
  app.get(`/pets`, fetchPetController(opts.petRepository));
  app.get(
    `/pets/mine`,
    { onRequest: verifyJWT },
    fetchPetsByOrgController(opts.petRepository),
  );
  app.get(
    `/pets/:petId`,
    detailsController(opts.orgRepository, opts.petRepository),
  );

  app.post(
    `/pets`,
    { onRequest: verifyJWT },
    createPetController(opts.orgRepository, opts.petRepository),
  );
  app.put(
    `/pets/:petId`,
    { onRequest: verifyJWT },
    updatePetController(opts.petRepository),
  );
  app.delete(
    `/pets/:petId`,
    { onRequest: verifyJWT },
    deletePetController(opts.petRepository),
  );
  app.patch(
    `/pets/:petId/publish`,
    { onRequest: verifyJWT },
    publishPetController(opts.orgRepository, opts.petRepository),
  );
};
