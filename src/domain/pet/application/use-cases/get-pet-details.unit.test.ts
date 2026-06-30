import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { GetPetDetailsUseCase } from "./get-pet-details";

let inMemoryOrgRepository: InMemoryOrgRepository;
let inMemoryPetRepository: InMemoryPetRepository;
let sut: GetPetDetailsUseCase;

describe("Get Pet Details Use Case", async () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository();
    inMemoryPetRepository = new InMemoryPetRepository();
    sut = new GetPetDetailsUseCase(
      inMemoryOrgRepository,
      inMemoryPetRepository,
    );
  });

  it("should get the details of a specific pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.pets.push(newPet);

    const { pet } = await sut.execute({
      id: newPet.id.toString(),
    });

    expect(pet.name).toEqual(newPet.name);
  });

  it("should throw an error if pet is not found", async () => {
    await expect(
      sut.execute({
        id: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should bring name and phone from org", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const { org } = await sut.execute({
      id: newPet.id.toString(),
    });

    expect(org).toEqual({
      name: newOrg.name,
      phone: newOrg.phone,
    });
  });
});
