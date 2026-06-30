import type { Organization } from "@/domain/organization/enterprise/entities/organization";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import type { Pet } from "@/domain/pet/enterprise/entities/pet";
import type { PetFilters } from "@/http/controllers/pets/fetch-pet";
import { normalize } from "@/utils/string-normalize";

export class InMemoryPetRepository implements PetRepository {
  pets: Pet[] = [];
  orgs: Organization[] = [];

  async findById(id: string) {
    const pet = this.pets.find((pet) => pet.id.toString() === id);

    if (!pet) {
      return null;
    }

    return pet;
  }

  async findByOrgId(orgId: string) {
    return this.pets.filter((pet) => pet.orgId.toString() === orgId);
  }

  async filter(orgCity: string, filters?: PetFilters) {
    const orgsOfCity = new Set(
      this.orgs
        .filter((org) => normalize(org.address.city) === normalize(orgCity))
        .map((org) => org.id.toString()),
    );

    return this.pets.filter((pet) => {
      let matchFilter: boolean = false;

      if (filters) {
        matchFilter = Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .some(([key, value]) => {
            const petValue = pet[key as keyof PetFilters] as string;

            return petValue === value;
          });
      }

      const matchOrg = orgsOfCity.has(pet.orgId.toString());

      if (matchFilter) {
        return matchOrg && matchFilter;
      }

      return matchOrg;
    });
  }

  async create(pet: Pet) {
    this.pets.push(pet);
  }

  async save(data: Pet): Promise<void> {
    const petIndex = this.pets.findIndex((pet) => pet.id === data.id);

    this.pets.splice(petIndex, 1, data);
  }

  async delete(pet: Pet): Promise<void> {
    const petIndex = this.pets.findIndex((p) => p.id === pet.id);

    this.pets.splice(petIndex, 1);
  }
}
