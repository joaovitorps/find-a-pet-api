import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { CreatePetUseCase } from "@/domain/pet/application/use-cases/create-pet";

const RequestBodySchema = z.object({
  name: z.string(),
  about: z.string().nullable(),
  status: z.string(),
  age: z.string(),
  size: z.string(),
  energyLevel: z.string(),
  independencyLevel: z.string(),
  environment: z.string(),
  pictures: z.array(z.string()),
  adoptionRequirements: z.array(z.string()),
});

const QueryUrlSchema = z.object({
  orgId: z.uuid(),
});

export const createPetController = (
  orgRepo: OrgRepository,
  petRepository: PetRepository,
) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { orgId } = QueryUrlSchema.parse(req.params);

    const {
      name,
      about,
      status,
      age,
      size,
      energyLevel,
      independencyLevel,
      environment,
      pictures,
      adoptionRequirements,
    } = RequestBodySchema.parse(req.body);

    await new CreatePetUseCase(petRepository, orgRepo).execute({
      orgId,
      name,
      about,
      status,
      age,
      size,
      energyLevel,
      independencyLevel,
      environment,
      pictures,
      adoptionRequirements,
    });

    return reply.code(201).send({ success: true });
  };
};
