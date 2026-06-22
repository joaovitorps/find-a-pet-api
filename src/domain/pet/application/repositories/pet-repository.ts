import type { Pet } from "../../enterprise/entities/pet";

export interface PetRepository {
  create(pet: Pet): Promise<void>;
}
