import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Organization } from "@/domain/organization/enterprise/entities/organization";
import { Address } from "@/domain/organization/enterprise/value-objects/address";
import { Password } from "@/domain/organization/enterprise/value-objects/password";
import { Phone } from "@/domain/organization/enterprise/value-objects/phone";
import type { Org } from "@/generated/prisma/client";

export function toDomain(raw: Org): Organization {
  return Organization.create(
    {
      name: raw.name,
      phone: Phone.create(raw.phone),
      password: Password.createFromHash(raw.password),
      email: raw.email,
      ownerName: raw.ownerName,
      address: Address.createFromString(raw.address),
    },
    new UniqueEntityID(raw.id),
  );
}

export function toDb(organization: Organization): Org {
  return {
    id: organization.id.toString(),
    name: organization.name,
    email: organization.email,
    password: organization.password.hash,
    ownerName: organization.ownerName,
    address: organization.address.toString(),
    phone: organization.phone,
  };
}
