import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { InMemoryPetRepository } from "@/test/repositories/in-memory-pet-repository";
import { FetchPetUseCase } from "./fetch-pet";

let inMemoryPetRepository: InMemoryPetRepository;
let sut: FetchPetUseCase;

describe("Fetch Pet Use Case", async () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository();
    sut = new FetchPetUseCase(inMemoryPetRepository);
  });

  it("should fetch all pets", async () => {
    const { newOrg } = await makeOrg();

    inMemoryPetRepository.orgs.push(newOrg);

    const { newPet } = await makePet({ orgId: newOrg.id });

    inMemoryPetRepository.create(newPet);

    const { pets } = await sut.execute({
      city: "São Paulo",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]?.name).toEqual(newPet.name);
  });
});
