import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { PetRepository } from "../repositories/pet-repository";

export interface DeletePetUseCaseParams {
  orgId: string;
  petId: string;
}

export class DeletePetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ orgId, petId }: DeletePetUseCaseParams): Promise<void> {
    const pet = await this.petRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    if (pet.orgId.toString() !== orgId) {
      throw new InvalidCredentialsError();
    }

    await this.petRepository.delete(pet);
  }
}
