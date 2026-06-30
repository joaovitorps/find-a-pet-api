import type { Pet } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface FetchPetsByOrgUseCaseParams {
  orgId: string;
}

export interface FetchPetsByOrgUseCaseReturn {
  pets: Pet[];
}

export class FetchPetsByOrgUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    orgId,
  }: FetchPetsByOrgUseCaseParams): Promise<FetchPetsByOrgUseCaseReturn> {
    const pets = await this.petRepository.findByOrgId(orgId);

    return { pets };
  }
}
