import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import {
  type Age,
  type EnergyLevel,
  type Environment,
  type IndependencyLevel,
  Pet,
  type Size,
  type Status,
} from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface CreatePetUseCaseParams {
  orgId: string;
  name: string;
  about: string | null;
  status: string;
  age: string;
  size: string;
  energyLevel: string;
  independencyLevel: string;
  environment: string;
  pictures: string[];
  adoptionRequirements: string[];
}

export class CreatePetUseCase {
  constructor(
    private petRepository: PetRepository,
    private orgRepository: OrgRepository,
  ) {}

  async execute({
    orgId,
    name,
    about,
    status,
    age,
    size,
    energyLevel,
    independencyLevel,
    environment,
    pictures,
    adoptionRequirements,
  }: CreatePetUseCaseParams): Promise<void> {
    if (!(await this.orgRepository.findById(orgId))) {
      throw new ResourceNotFoundError();
    }

    const pet = Pet.create({
      orgId: new UniqueEntityID(orgId),
      name,
      about,
      status: status as Status,
      age: age as Age,
      size: size as Size,
      energyLevel: energyLevel as EnergyLevel,
      independencyLevel: independencyLevel as IndependencyLevel,
      environment: environment as Environment,
      pictures,
      adoptionRequirements,
    });

    await this.petRepository.create(pet);
  }
}
