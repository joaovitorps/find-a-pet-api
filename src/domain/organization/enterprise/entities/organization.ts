import type { Optional } from "@/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";
import type { Address } from "../value-objects/address";
import type { Password } from "../value-objects/password";
import type { Phone } from "../value-objects/phone";

export interface OrganizationProps {
  name: string;
  email: string;
  password: Password;
  ownerName: string;
  address: Address;
  phone: Phone;
  createdAt: Date;
  updatedAt?: Date;
}

export class Organization extends Entity<OrganizationProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get ownerName() {
    return this.props.ownerName;
  }

  get address() {
    return this.props.address;
  }

  get phone() {
    return this.props.phone.number;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<OrganizationProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Organization(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
