import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { UpdatePetUseCase } from "@/domain/pet/application/use-cases/update-pet";

const ParamsUrlSchema = z.object({
  petId: z.uuid(),
});

const RequestBodySchema = z.strictObject({
  name: z.string().optional(),
  about: z.string().nullable().optional(),
  age: z.string().optional(),
  size: z.string().optional(),
  energyLevel: z.string().optional(),
  independencyLevel: z.string().optional(),
  environment: z.string().optional(),
  pictures: z.array(z.string()).optional(),
  adoptionRequirements: z.array(z.string()).optional(),
});

export const updatePetController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const orgId = req.org.id;
    const { petId } = ParamsUrlSchema.parse(req.params);
    const body = RequestBodySchema.parse(req.body);

    await new UpdatePetUseCase(petRepository).execute({
      orgId,
      petId,
      name: body.name,
      about: body.about,
      age: body.age,
      size: body.size,
      energyLevel: body.energyLevel,
      independencyLevel: body.independencyLevel,
      environment: body.environment,
      pictures: body.pictures,
      adoptionRequirements: body.adoptionRequirements,
    });

    return reply.code(204).send();
  };
};
