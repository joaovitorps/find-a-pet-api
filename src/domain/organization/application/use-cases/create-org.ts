import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { Organization } from "../../enterprise/entities/organization";
import { Address } from "./value-objects/address";
import { Phone } from "./value-objects/phone";

interface CreateOrgUseCaseParams {
  name: string;
  phone: string;
  address: {
    number: string;
    street: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface CreateOrgUseCaseReturn {
  organization: Organization;
}

export class CreateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    name,
    address,
    phone,
  }: CreateOrgUseCaseParams): Promise<CreateOrgUseCaseReturn> {
    const createdAddress = Address.create({ ...address });

    const organization = Organization.create({
      name,
      address: createdAddress,
      phone: Phone.create(phone),
    });

    await this.orgRepository.create(organization);

    return { organization };
  }
}
