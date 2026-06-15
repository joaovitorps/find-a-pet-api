import { z } from "zod";
import { CreateOrgUseCase } from "@/domain/organization/application/use-cases/create-org";
import { Address } from "@/domain/organization/application/use-cases/value-objects/address";
import { InMemoryOrgRepository } from "@/test/repository/in-memory-org-repository";

let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: CreateOrgUseCase;

describe("Create Org Use Case", async () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new CreateOrgUseCase(inMemoryOrgRepository);
  });

  it("should create a organization", async () => {
    const address = new Address({
      number: "123",
      street: "Old Street",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
    });

    const orgData = {
      name: "Animals Org",
      address: address,
      phone: "+5511987654321",
    };

    const { organization } = await sut.execute(orgData);

    expect(organization).toEqual(expect.objectContaining(orgData));
    expect(z.safeParse(z.uuidv4(), organization.id.toValue()).success).toBe(
      true,
    );
    expect(inMemoryOrgRepository.orgs).toHaveLength(1);
  });

  it("should fail on invalid phone number", async () => {
    const address = new Address({
      number: "123",
      street: "Old Street",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
    });

    const orgData = {
      name: "Animals Org",
      address: address,
      phone: "++5511987654321",
    };

    await expect(() => sut.execute(orgData)).rejects.toBeInstanceOf(Error);
    await expect(() => sut.execute(orgData)).rejects.toEqual(
      expect.objectContaining({ message: "Invalid phone number." }),
    );
    expect(inMemoryOrgRepository.orgs).toHaveLength(0);
  });
});
