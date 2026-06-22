import type { Pet } from "@/domain/pet/enterprise/entities/pet";
import type { PetUncheckedCreateInput } from "@/generated/prisma/models";

export function toCreateInput(pet: Pet): PetUncheckedCreateInput {
  return {
    orgId: pet.orgId.toString(),
    name: pet.name,
    about: pet.about,
    status: pet.status,
    age: pet.age,
    size: pet.size,
    energyLevel: pet.energyLevel,
    independencyLevel: pet.independencyLevel,
    environment: pet.environment,
    pictures: pet.pictures,
    adoptionRequirements: pet.adoptionRequirements,
  };
}
