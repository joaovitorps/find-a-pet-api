import { ValidationError } from "@/core/errors/validation-error";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { PublishPetUseCase } from "./publish-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: PublishPetUseCase;

describe("Publish Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new PublishPetUseCase(inMemoryPetRepository);
  });

  it("should publish a Pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg.toDBCreateDTO());

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    await sut.execute({ id: newPet.id.toString() });

    expect(inMemoryPetRepository.pets[0]?.status).toEqual("PUBLISHED");
  });

  it("should not be able to publish a Pet with no pictures", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg.toDBCreateDTO());

    const { newPet } = await makePet({ orgId: newOrg.id, pictures: [] });

    inMemoryPetRepository.create(newPet);

    await expect(
      sut.execute({ id: newPet.id.toString() }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(inMemoryPetRepository.pets[0]?.status).toEqual("DRAFT");
  });

  it("should not be able to publish a Pet with no adoption requirements", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg.toDBCreateDTO());

    const { newPet } = await makePet({
      orgId: newOrg.id,
      adoptionRequirements: [],
    });

    inMemoryPetRepository.create(newPet);

    await expect(
      sut.execute({ id: newPet.id.toString() }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(inMemoryPetRepository.pets[0]?.status).toEqual("DRAFT");
  });
});
