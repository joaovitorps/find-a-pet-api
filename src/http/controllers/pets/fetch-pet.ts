import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import { FetchPetUseCase } from "@/domain/pet/application/use-cases/fetch-pet";
import { Age, Size } from "@/domain/pet/enterprise/entities/pet";
import { EnergyLevel, IndependencyLevel } from "@/generated/prisma/enums";

const QueryUrlSchema = z.object({
  city: z.string(),
  age: z.enum(Age).optional(),
  size: z.enum(Size).optional(),
  energyLevel: z.enum(EnergyLevel).optional(),
  independencyLevel: z.enum(IndependencyLevel).optional(),
});

// Or const QueryUrlSchema = PetFiltersSchema.extend({ city: z.string() });

type QueryUrl = z.infer<typeof QueryUrlSchema>;

export type PetFilters = Omit<QueryUrl, "city">;

export const fetchPetController = (petRepository: PetRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { city, ...petFilters } = QueryUrlSchema.parse(req.query);

    const { pets } = await new FetchPetUseCase(petRepository).execute({
      city,
      petFilters,
    });

    return reply.code(200).send({ pets });
  };
};
