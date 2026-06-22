import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import type { Pet } from "@/domain/pet/enterprise/entities/pet";

export class InMemoryPetRepository implements PetRepository {
  pets: Pet[] = [];

  async create(pet: Pet) {
    this.pets.push(pet);
  }
}
