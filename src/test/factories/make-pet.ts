import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Age,
  EnergyLevel,
  Environment,
  IndependencyLevel,
  Pet,
  type PetProps,
  Size,
  Status,
} from "@/domain/pet/enterprise/entities/pet";

export async function makePet(
  overwrite: Partial<PetProps> = {},
  id?: UniqueEntityID,
) {
  const petParams = {
    name: "Buddy",
    about: "A friendly dog",
    status: Status.DRAFT,
    age: Age.FILHOTE,
    size: Size.MEDIO,
    energyLevel: EnergyLevel.ALTO,
    independencyLevel: IndependencyLevel.BAIXO,
    environment: Environment.APARTAMENTO,
    pictures: ["image1.jpg"],
    adoptionRequirements: ["daily walks"],
    orgId: new UniqueEntityID("org-1"),
    ...overwrite,
  };

  const newPet = Pet.create(petParams, id);

  return { petParams, newPet };
}
