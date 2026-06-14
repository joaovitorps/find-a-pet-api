import z from "zod";
import { InMemoryOrgRepository } from "@/repositories/in-memory-org-repository";
import { CreateOrgUseCase } from "@/use-cases/create-org";

let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: CreateOrgUseCase;

describe("Create Org Use Case", async () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new CreateOrgUseCase(inMemoryOrgRepository);
  });

  it("should create a organization", async () => {
    const orgData = {
      name: "Animals Org",
      address: "Doe street",
      phone: "00000000000",
    };

    const { org } = await sut.execute(orgData);

    expect(org).toEqual(expect.objectContaining(orgData));
    expect(true).toBe(z.safeParse(z.uuidv4(), org.id).success);
    expect(inMemoryOrgRepository.orgs).toHaveLength(1);
  });
});
