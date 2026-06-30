import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { FetchPetsByOrgUseCase } from "./fetch-pets-by-org";

let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: FetchPetsByOrgUseCase;

describe("Fetch Pets By Org Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new FetchPetsByOrgUseCase(inMemoryPetRepository);
  });

  it("should fetch all pets from an org", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { newPet: pet1 } = await makePet({ orgId: newOrg.id });
    const { newPet: pet2 } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(pet1);
    inMemoryPetRepository.create(pet2);

    const { pets } = await sut.execute({ orgId: newOrg.id.toString() });

    expect(pets).toHaveLength(2);
    expect(pets[0]?.name).toEqual(pet1.name);
    expect(pets[1]?.name).toEqual(pet2.name);
  });

  it("should return empty array when org has no pets", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { pets } = await sut.execute({ orgId: newOrg.id.toString() });

    expect(pets).toHaveLength(0);
  });

  it("should not fetch pets from a different org", async () => {
    const { newOrg: org1 } = await makeOrg();
    const { newOrg: org2 } = await makeOrg({ email: "other@org.com" });

    inMemoryOrgRepository.create(org1);
    inMemoryOrgRepository.create(org2);

    const { newPet: pet1 } = await makePet({ orgId: org1.id });

    inMemoryPetRepository.create(pet1);

    const { pets } = await sut.execute({ orgId: org2.id.toString() });

    expect(pets).toHaveLength(0);
  });
});
