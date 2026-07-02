import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { Age, EnergyLevel, Status } from "../../enterprise/entities/pet";
import { FetchPetUseCase } from "./fetch-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let sut: FetchPetUseCase;

describe("Fetch Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    sut = new FetchPetUseCase(inMemoryPetRepository);
  });

  it("should fetch ONLY PUBLISHED pets from a city", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({
      orgId: newOrg.id,
      status: Status.PUBLISHED,
    });

    inMemoryPetRepository.create(newPet);

    const { pets } = await sut.execute({
      city: "São Paulo",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toEqual(newPet.name);
  });

  it("should fetch ONLY PUBLISHED pets", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });
    const { newPet: pet2 } = await makePet({
      orgId: newOrg.id,
      status: Status.PUBLISHED,
    });

    inMemoryPetRepository.create(newPet);
    inMemoryPetRepository.create(pet2);

    const { pets } = await sut.execute({
      city: "São Paulo",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.status).toEqual(Status.PUBLISHED);
  });

  it("should fetch ONLY PUBLISHED pets by age", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const petFilters = {
      age: Age.FILHOTE,
    };

    const { pets } = await sut.execute({
      city: "São Paulo",
      petFilters,
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toEqual(newPet.name);
  });

  it("should fetch no pets when filter does not match", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const petFilters = {
      age: Age.FILHOTE,
    };

    const { pets } = await sut.execute({
      city: "no matching city",
      petFilters,
    });

    expect(pets).toHaveLength(0);
  });

  it("should fetch ONLY PUBLISHED pets if one or more filter matches", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const petFilters = {
      age: Age.FILHOTE,
      energyLevel: EnergyLevel.MEDIO,
    };

    const { pets } = await sut.execute({
      city: "São Paulo",
      petFilters,
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toEqual(newPet.name);
  });

  it("should fetch ONLY PUBLISHED pets if one filter matches and other no", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const petFilters = {
      age: Age.FILHOTE,
      energyLevel: EnergyLevel.BAIXO,
    };

    const { pets } = await sut.execute({
      city: "São Paulo",
      petFilters,
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toEqual(newPet.name);
  });
});
