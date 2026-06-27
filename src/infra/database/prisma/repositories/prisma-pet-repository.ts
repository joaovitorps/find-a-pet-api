import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { PetRepository } from "@/domain/pet/application/repositories/pet-repository";
import {
  type Age,
  type EnergyLevel,
  type Environment,
  type IndependencyLevel,
  Pet,
  type Size,
  type Status,
} from "@/domain/pet/enterprise/entities/pet";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PetUncheckedUpdateInput } from "@/generated/prisma/models";
import { toCreateInput } from "@/infra/mappers/pet-mapper";
import { prisma } from "@/lib/prisma";
import { normalize } from "@/utils/string-normalize";

export class PrismaPetRepository implements PetRepository {
  pets: Pet[] = [];

  constructor(private db: PrismaClient = prisma) {}

  async getById(id: string): Promise<Pet | null> {
    const pet = await this.db.pet.findFirst({
      where: { id },
    });

    if (!pet) {
      return null;
    }

    return Pet.create(
      {
        orgId: new UniqueEntityID(pet.orgId),
        name: pet.name,
        about: pet.about,
        status: pet.status as Status,
        age: pet.age as Age,
        size: pet.size as Size,
        energyLevel: pet.energyLevel as EnergyLevel,
        independencyLevel: pet.independencyLevel as IndependencyLevel,
        environment: pet.environment as Environment,
        pictures: pet.pictures,
        adoptionRequirements: pet.adoptionRequirements,
      },
      new UniqueEntityID(id),
    );
  }

  async save(pet: Pet): Promise<void> {
    await this.db.pet.update({
      where: { id: pet.id.toString() },
      data: {
        status: "PUBLISHED",
      },
    });
  }

  async fetchByCity(city: string): Promise<Pet[]> {
    const [results] = await this.db.org.findMany({
      select: {
        pets: true,
      },
      where: { address: { contains: normalize(city), mode: "insensitive" } },
    });

    if (!results) {
      return [];
    }

    return results.pets.map((pet) =>
      Pet.create({
        orgId: new UniqueEntityID(pet.orgId),
        name: pet.name,
        about: pet.about,
        status: pet.status,
        age: pet.age as Age,
        size: pet.size as Size,
        energyLevel: pet.energyLevel as EnergyLevel,
        independencyLevel: pet.independencyLevel as IndependencyLevel,
        environment: pet.environment as Environment,
        pictures: pet.pictures,
        adoptionRequirements: pet.adoptionRequirements,
      }),
    );
  }

  async create(pet: Pet): Promise<void> {
    await this.db.pet.create({ data: toCreateInput(pet) });
  }
}
