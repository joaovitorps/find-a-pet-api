import type { Optional } from "@/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export enum Status {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum Age {
  FILHOTE = "FILHOTE",
  ADULTO = "ADULTO",
  IDOSO = "IDOSO",
}

export enum Size {
  PEQUENO = "PEQUENO",
  MEDIO = "MEDIO",
  GRANDE = "GRANDE",
}

export enum EnergyLevel {
  BAIXO = "BAIXO",
  MEDIO = "MEDIO",
  ALTO = "ALTO",
}

export enum IndependencyLevel {
  BAIXO = "BAIXO",
  MEDIO = "MEDIO",
  ALTO = "ALTO",
}

export enum Environment {
  AMBIENTE_AMPLO = "AMBIENTE_AMPLO",
  APARTAMENTO = "APARTAMENTO",
  AMBIENTE_CONTROLADO = "AMBIENTE_CONTROLADO",
  AR_LIVRE = "AR_LIVRE",
}

export interface PetProps {
  orgId: UniqueEntityID;
  name: string;
  about: string | null;
  status: Status;
  age: Age;
  size: Size;
  energyLevel: EnergyLevel;
  independencyLevel: IndependencyLevel;
  environment: Environment;
  pictures: string[];
  adoptionRequirements: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export class Pet extends Entity<PetProps> {
  get orgId(): UniqueEntityID {
    return this.props.orgId;
  }

  get name(): string {
    return this.props.name;
  }

  get about(): string | null {
    return this.props.about ?? null;
  }

  get status(): Status {
    return this.props.status;
  }

  get age(): Age {
    return this.props.age;
  }

  get size(): Size {
    return this.props.size;
  }

  get energyLevel(): EnergyLevel {
    return this.props.energyLevel;
  }

  get independencyLevel(): IndependencyLevel {
    return this.props.independencyLevel;
  }

  get environment(): Environment {
    return this.props.environment;
  }

  get pictures(): string[] {
    return this.props.pictures;
  }

  get adoptionRequirements(): string[] {
    return this.props.adoptionRequirements;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set status(status: Status) {
    this.props.status = status;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<PetProps, "createdAt">, id?: UniqueEntityID) {
    return new Pet(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
