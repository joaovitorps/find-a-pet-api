import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { FetchPetUseCase } from "@/domain/pet/application/use-cases/fetch-pet";

const QueryUrlSchema = z.object({
  city: z.string(),
});

export const fetchPetController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { city } = QueryUrlSchema.parse(req.query);

    const { pets } = await new FetchPetUseCase(petRepository).execute({
      city,
    });

    return reply.code(200).send({ pets });
  };
};
