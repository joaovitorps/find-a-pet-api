import type { Pet } from "../../enterprise/entities/pet";

export interface PetRepository {
  fetchByCity(city: string): Promise<Pet[]>;
  create(pet: Pet): Promise<void>;
}
