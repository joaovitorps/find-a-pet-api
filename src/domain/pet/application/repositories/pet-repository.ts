import type { Pet } from "../../enterprise/entities/pet";

export interface PetRepository {
  getById(id: string): Promise<Pet | null>;
  fetchByCity(city: string): Promise<Pet[]>;
  create(pet: Pet): Promise<void>;
  save(pet: Pet): Promise<void>;
}
