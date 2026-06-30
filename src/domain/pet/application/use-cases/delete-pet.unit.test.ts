import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { DeletePetUseCase } from "./delete-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: DeletePetUseCase;

describe("Delete Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new DeletePetUseCase(inMemoryPetRepository);
  });

  it("should delete a pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    await sut.execute({
      orgId: newOrg.id.toString(),
      petId: newPet.id.toString(),
    });

    expect(inMemoryPetRepository.pets).toHaveLength(0);
  });

  it("should throw if pet does not exist", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    await expect(
      sut.execute({
        orgId: newOrg.id.toString(),
        petId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw if org does not own the pet", async () => {
    const { newOrg: org1 } = await makeOrg();
    const { newOrg: org2 } = await makeOrg({ email: "other@org.com" });

    inMemoryOrgRepository.create(org1);
    inMemoryOrgRepository.create(org2);

    const { newPet } = await makePet({ orgId: org1.id });

    inMemoryPetRepository.create(newPet);

    await expect(
      sut.execute({
        orgId: org2.id.toString(),
        petId: newPet.id.toString(),
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
