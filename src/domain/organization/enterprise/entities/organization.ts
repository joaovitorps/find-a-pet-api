import type { Optional } from "@/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { OrgUncheckedCreateInput } from "@/generated/prisma/models";
import type { Address } from "../value-objects/address";
import type { Password } from "../value-objects/password";
import { Phone } from "../value-objects/phone";

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

  // private touch() {
  //   this.props.updatedAt = new Date();
  // }

  toDBCreateDTO(): OrgUncheckedCreateInput {
    return {
      id: this.id.toString(),
      name: this.name,
      email: this.email,
      password: this.password.hash,
      ownerName: this.ownerName,
      address: this.address.toString(),
      phone: this.phone,
    };
  }

  static create(
    props: Optional<OrganizationProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Organization(
      {
        ...props,
        phone: Phone.create(props.phone.number),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
