import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { PublishPetUseCase } from "@/domain/pet/application/use-cases/publish-pet";

const ParamsUrlSchema = z.object({
  petId: z.uuidv4(),
});

export const publishPetController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { petId } = ParamsUrlSchema.parse(req.params);

    await new PublishPetUseCase(petRepository).execute({
      id: petId,
    });

    return reply.code(204).send();
  };
};
