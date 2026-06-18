import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { CreateOrgUseCaseParams } from "@/domain/organization/application/use-cases/create-org";
import { Organization } from "@/domain/organization/enterprise/entities/organization";
import { Address } from "@/domain/organization/enterprise/value-objects/address";
import { Password } from "@/domain/organization/enterprise/value-objects/password";
import { Phone } from "@/domain/organization/enterprise/value-objects/phone";

export async function makeOrg(
  overwrite: Partial<CreateOrgUseCaseParams> = {},
  id?: UniqueEntityID,
) {
  const orgData: CreateOrgUseCaseParams = {
    name: "Animals Org",
    email: "ronaldo@animalorg.com",
    password: "safePass123",
    ownerName: "Ronaldo",
    address: {
      number: "123",
      street: "Old Street",
      neighborhood: "Centro",
      city: "Sao Paulo",
      state: "SP",
    },
    phone: "+5511987654321",
    ...overwrite,
  };

  const newOrg = Organization.create(
    {
      ...orgData,
      address: Address.create(orgData.address),
      phone: Phone.create(orgData.phone),
      password: await Password.create(orgData.password),
    },
    id,
  );

  return { newOrg, orgData };
}
