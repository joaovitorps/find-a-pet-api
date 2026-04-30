import type { Org } from "@/generated/prisma/client";
import type { OrgRepository } from "@/repositories/org-repository";

interface CreateOrgUseCaseParams {
  name: string;
  address: string;
  phone: string;
}

interface CreateOrgUseCaseReturn {
  org: Org;
}

export class CreateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    name,
    address,
    phone,
  }: CreateOrgUseCaseParams): Promise<CreateOrgUseCaseReturn> {
    const org = await this.orgRepository.create({ name, address, phone });

    return { org };
  }
}
