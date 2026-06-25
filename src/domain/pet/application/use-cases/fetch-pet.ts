import type { Pet } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface FetchPetUseCaseParams {
  city: string;
}

export interface FetchPetUseCaseReturn {
  pets: Pet[];
}

export class FetchPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    city,
  }: FetchPetUseCaseParams): Promise<FetchPetUseCaseReturn> {
    const pets = await this.petRepository.fetchByCity(city);

    return { pets };
  }
}
