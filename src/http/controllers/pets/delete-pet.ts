import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { DeletePetUseCase } from "@/domain/pet/application/use-cases/delete-pet";

const ParamsUrlSchema = z.object({
  petId: z.uuid(),
});

export const deletePetController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const orgId = req.org.id;
    const { petId } = ParamsUrlSchema.parse(req.params);

    await new DeletePetUseCase(petRepository).execute({
      orgId,
      petId,
    });

    return reply.code(204).send();
  };
};
