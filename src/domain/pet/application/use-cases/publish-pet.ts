import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ValidationError } from "@/core/errors/validation-error";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import { type Pet, Status } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export function getPublishEligibility(org: Organization, pet: Pet) {
  if (pet.orgId.toString() !== org.id.toString()) {
    return { allowed: false, error: new InvalidCredentialsError() };
  }

  if (pet.pictures.length === 0) {
    return {
      allowed: false,
      error: new ValidationError("Needs at least one photo."),
    };
  }

  if (pet.adoptionRequirements.length === 0) {
    return {
      allowed: false,
      error: new ValidationError("Needs at least one adoption requirement."),
    };
  }

  return { allowed: true };
}

export interface FetchPetUseCaseParams {
  orgId: string;
  petId: string;
}

export class PublishPetUseCase {
  constructor(
    private orgRepository: OrgRepository,
    private petRepository: PetRepository,
  ) {}

  async execute({ orgId, petId }: FetchPetUseCaseParams): Promise<void> {
    const org = await this.orgRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const pet = await this.petRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    const eligibility = getPublishEligibility(org, pet);

    if (!eligibility.allowed) {
      throw eligibility.error;
    }

    (pet as Pet).status = Status.PUBLISHED;

    this.petRepository.save(pet as Pet);
  }
}
