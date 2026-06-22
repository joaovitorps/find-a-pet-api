import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import type { Pet } from "@/domain/pet/enterprise/entities/pet";
import type { PrismaClient } from "@/generated/prisma/client";
import { toCreateInput } from "@/infra/mappers/pet-mapper";
import { prisma } from "@/lib/prisma";

export class PrismaPetRepository implements PetRepository {
  pets: Pet[] = [];

  constructor(private db: PrismaClient = prisma) {}

  async create(pet: Pet): Promise<void> {
    await this.db.pet.create({ data: toCreateInput(pet) });
  }
}
