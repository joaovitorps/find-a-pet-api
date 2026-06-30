import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import type { Pet } from "../../enterprise/entities/pet";
import type { PetRepository } from "../repositories/pet-repository";

export interface GetPetDetailsUseCaseParams {
  id: string;
}

export interface GetPetDetailsUseCaseReturn {
  pet: Pet;
  org: Pick<Organization, "name" | "phone">;
}

export class GetPetDetailsUseCase {
  constructor(
    private orgRepository: OrgRepository,
    private petRepository: PetRepository,
  ) {}

  async execute({
    id,
  }: GetPetDetailsUseCaseParams): Promise<GetPetDetailsUseCaseReturn> {
    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    const org = await this.orgRepository.findById(pet.orgId.toString());

    if (!org) {
      throw new ResourceNotFoundError();
    }

    return {
      pet: pet,
      org: {
        name: org.name,
        phone: org.phone.toString(),
      },
    };
  }
}
