import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { PublishPetUseCase } from "@/domain/pet/application/use-cases/publish-pet";

const ParamsUrlSchema = z.object({
  petId: z.uuidv4(),
});

export const publishPetController = (
  orgRepository: OrgRepository,
  petRepository: PetRepository,
) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const orgId = req.org.id;
    const { petId } = ParamsUrlSchema.parse(req.params);

    await new PublishPetUseCase(orgRepository, petRepository).execute({
      orgId: orgId,
      petId: petId,
    });

    return reply.code(204).send();
  };
};
