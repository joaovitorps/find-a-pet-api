import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { GetPetDetailsUseCase } from "@/domain/pet/application/use-cases/get-pet-details";

const ParamsUrlSchema = z.object({
  petId: z.uuidv4(),
});

export const detailsController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { petId } = ParamsUrlSchema.parse(req.params);

    const { pet } = await new GetPetDetailsUseCase(petRepository).execute({
      id: petId,
    });

    return reply.code(200).send({ pet });
  };
};
