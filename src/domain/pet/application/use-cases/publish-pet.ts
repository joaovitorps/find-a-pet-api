import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ValidationError } from "@/core/errors/validation-error";
import { type Pet, Status } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export function getPublishEligibility(pet: Pet | null) {
  if (!pet) {
    return { allowed: false, error: new ResourceNotFoundError() };
  }

  if (pet.pictures.length === 0 || pet.adoptionRequirements.length === 0) {
    return {
      allowed: false,
      error: new ValidationError({ cause: "Needs at least one photo." }),
    };
  }

  if (pet.adoptionRequirements.length === 0) {
    return {
      allowed: false,
      error: new ValidationError({
        cause: "Needs at least one adoption requirement.",
      }),
    };
  }

  return { allowed: true };
}

export interface FetchPetUseCaseParams {
  id: string;
}

export class PublishPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ id }: FetchPetUseCaseParams): Promise<void> {
    const pet = await this.petRepository.getById(id);

    const eligibility = getPublishEligibility(pet);

    if (!eligibility.allowed) {
      throw eligibility.error;
    }

    (pet as Pet).status = Status.PUBLISHED;

    this.petRepository.save(pet as Pet);
  }
}
