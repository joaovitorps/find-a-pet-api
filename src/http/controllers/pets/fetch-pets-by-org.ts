import type { FastifyReply, FastifyRequest } from "fastify";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { FetchPetsByOrgUseCase } from "@/domain/pet/application/use-cases/fetch-pets-by-org";

export const fetchPetsByOrgController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const orgId = req.org.id;

    const { pets } = await new FetchPetsByOrgUseCase(petRepository).execute({
      orgId,
    });

    return reply.code(200).send({ pets });
  };
};
