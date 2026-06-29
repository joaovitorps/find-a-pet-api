import type { PetFilters } from "@/http/controllers/pets/fetch-pet";
import type { Pet } from "../../enterprise/entities/pet";

export interface PetRepository {
  getById(id: string): Promise<Pet | null>;
  filter(orgCity: string, filters?: PetFilters): Promise<Pet[]>;
  create(pet: Pet): Promise<void>;
  save(pet: Pet): Promise<void>;
}
