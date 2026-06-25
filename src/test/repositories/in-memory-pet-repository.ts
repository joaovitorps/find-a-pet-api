import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import type { Pet } from "@/domain/pet/enterprise/entities/pet";
import { normalize } from "@/utils/string-normalize";

export class InMemoryPetRepository implements PetRepository {
  pets: Pet[] = [];
  orgs: Organization[] = [];

  async fetchByCity(city: string) {
    const orgsOfCity = new Set(
      this.orgs
        .filter((org) => normalize(org.address.city) === normalize(city))
        .map((org) => org.id.toString()),
    );

    return this.pets.filter((pet) => orgsOfCity.has(pet.orgId.toString()));
  }

  async create(pet: Pet) {
    this.pets.push(pet);
  }
}
