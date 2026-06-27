import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { Pet } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface GetPetDetailsUseCaseParams {
  id: string;
}

export interface GetPetDetailsUseCaseReturn {
  pet: Pet;
}

export class GetPetDetailsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    id,
  }: GetPetDetailsUseCaseParams): Promise<GetPetDetailsUseCaseReturn> {
    const pet = await this.petRepository.getById(id);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    return { pet };
  }
}
