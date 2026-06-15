import type { Optional } from "@/@types/optional";
import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Address } from "../value-objects/address";
import { Phone } from "../value-objects/phone";

export interface OrganizationProps {
  name: string;
  address: Address;
  phone: Phone;
  createdAt: Date;
  updatedAt?: Date;
}

export class Organization extends Entity<OrganizationProps> {
  get name() {
    return this.props.name;
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
