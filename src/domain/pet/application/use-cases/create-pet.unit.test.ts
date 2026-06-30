import { ValidationError } from "@/core/errors/validation-error";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { CreatePetUseCase } from "./create-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: CreatePetUseCase;

describe("Create Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new CreatePetUseCase(inMemoryPetRepository, inMemoryOrgRepository);
  });

  it("should create a Pet", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { petParams } = await makePet({ orgId: newOrg.id });

    await sut.execute({
      orgId: petParams.orgId.toString(),
      name: petParams.name,
      about: petParams.about,
      status: petParams.status,
      age: petParams.age,
      size: petParams.size,
      energyLevel: petParams.energyLevel,
      independencyLevel: petParams.independencyLevel,
      environment: petParams.environment,
      pictures: petParams.pictures,
      adoptionRequirements: petParams.adoptionRequirements,
    });

    expect(petParams.name).toEqual(inMemoryPetRepository.pets[0]?.name);
    expect(inMemoryPetRepository.pets).toHaveLength(1);
  });

  it("should not create a Pet with more than 3 pictures", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { petParams } = await makePet({
      orgId: newOrg.id,
      pictures: ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"],
    });

    await expect(
      sut.execute({
        orgId: petParams.orgId.toString(),
        name: petParams.name,
        about: petParams.about,
        status: petParams.status,
        age: petParams.age,
        size: petParams.size,
        energyLevel: petParams.energyLevel,
        independencyLevel: petParams.independencyLevel,
        environment: petParams.environment,
        pictures: petParams.pictures,
        adoptionRequirements: petParams.adoptionRequirements,
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(inMemoryPetRepository.pets).toHaveLength(0);
  });

  it("should not create a Pet with more than 3 adoptionRequirements", async () => {
    const { newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg);

    const { petParams } = await makePet({
      orgId: newOrg.id,
      adoptionRequirements: ["adr1", "adr2", "adr3", "adr4"],
    });

    await expect(
      sut.execute({
        orgId: petParams.orgId.toString(),
        name: petParams.name,
        about: petParams.about,
        status: petParams.status,
        age: petParams.age,
        size: petParams.size,
        energyLevel: petParams.energyLevel,
        independencyLevel: petParams.independencyLevel,
        environment: petParams.environment,
        pictures: petParams.pictures,
        adoptionRequirements: petParams.adoptionRequirements,
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(inMemoryPetRepository.pets).toHaveLength(0);
  });
});
