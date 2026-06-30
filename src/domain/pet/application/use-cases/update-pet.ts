import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type {
  Age,
  EnergyLevel,
  Environment,
  IndependencyLevel,
  Size,
} from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface UpdatePetUseCaseParams {
  orgId: string;
  petId: string;
  name?: string | undefined;
  about?: string | null | undefined;
  age?: string | undefined;
  size?: string | undefined;
  energyLevel?: string | undefined;
  independencyLevel?: string | undefined;
  environment?: string | undefined;
  pictures?: string[] | undefined;
  adoptionRequirements?: string[] | undefined;
}

export class UpdatePetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    orgId,
    petId,
    ...props
  }: UpdatePetUseCaseParams): Promise<void> {
    const pet = await this.petRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    if (pet.orgId.toString() !== orgId) {
      throw new InvalidCredentialsError();
    }

    if (props.name !== undefined) pet.name = props.name;
    if (props.about !== undefined) pet.about = props.about;
    if (props.age !== undefined) pet.age = props.age as Age;
    if (props.size !== undefined) pet.size = props.size as Size;
    if (props.energyLevel !== undefined)
      pet.energyLevel = props.energyLevel as EnergyLevel;
    if (props.independencyLevel !== undefined)
      pet.independencyLevel = props.independencyLevel as IndependencyLevel;
    if (props.environment !== undefined)
      pet.environment = props.environment as Environment;
    if (props.pictures !== undefined) pet.pictures = props.pictures;
    if (props.adoptionRequirements !== undefined)
      pet.adoptionRequirements = props.adoptionRequirements;

    await this.petRepository.save(pet);
  }
}
