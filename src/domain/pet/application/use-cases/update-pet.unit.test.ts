import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { Age, Size } from "../../enterprise/entities/pet";
import { UpdatePetUseCase } from "./update-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: UpdatePetUseCase;

describe("Update Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new UpdatePetUseCase(inMemoryPetRepository);
  });

  it("should update a pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    await sut.execute({
      orgId: newOrg.id.toString(),
      petId: newPet.id.toString(),
      name: "Updated name",
      about: "Updated about",
      age: Age.ADULTO,
      size: Size.GRANDE,
    });

    expect(inMemoryPetRepository.pets[0]?.name).toEqual("Updated name");
    expect(inMemoryPetRepository.pets[0]?.about).toEqual("Updated about");
    expect(inMemoryPetRepository.pets[0]?.age).toEqual(Age.ADULTO);
    expect(inMemoryPetRepository.pets[0]?.size).toEqual(Size.GRANDE);
  });

  it("should throw if pet does not exist", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    await expect(
      sut.execute({
        orgId: newOrg.id.toString(),
        petId: "non-existent-id",
        name: "Updated",
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
        name: "Updated",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
