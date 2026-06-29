import type { PetFilters } from "@/http/controllers/pets/fetch-pet";
import type { Pet } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface FetchPetUseCaseParams {
  city: string;
  petFilters?: PetFilters;
}

export interface FetchPetUseCaseReturn {
  pets: Pet[];
}

export class FetchPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    city,
    petFilters,
  }: FetchPetUseCaseParams): Promise<FetchPetUseCaseReturn> {
    const pets = await this.petRepository.filter(city, petFilters);

    return { pets };
  }
}
