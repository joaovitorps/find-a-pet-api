import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { GetPetDetailsUseCase } from "./get-pet-details";

let inMemoryPetRepository: InMemoryPetRepository;
let sut: GetPetDetailsUseCase;

describe("Get Pet Details Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    sut = new GetPetDetailsUseCase(inMemoryPetRepository);
  });

  it("should get the details of a specific pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

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
});
