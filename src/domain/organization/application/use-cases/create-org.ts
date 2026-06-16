import { ResourceAlreadyExists } from "@/core/errors/resource-already-exists-error";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { Organization } from "../../enterprise/entities/organization";
import { Address } from "../../enterprise/value-objects/address";
import { Phone } from "../../enterprise/value-objects/phone";

export interface CreateOrgUseCaseParams {
  name: string;
  email: string;
  password: string;
  ownerName: string;
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
    email,
    password,
    ownerName,
    address,
    phone,
  }: CreateOrgUseCaseParams): Promise<CreateOrgUseCaseReturn> {
    if (await this.orgRepository.findByNameAndPhone(name, phone)) {
      throw new ResourceAlreadyExists();
    }

    const createdAddress = Address.create({ ...address });

    const organization = Organization.create({
      name,
      email,
      password,
      ownerName,
      address: createdAddress,
      phone: Phone.create(phone),
    });

    await this.orgRepository.create(organization.toDBCreateDTO());

    return { organization };
  }
}
