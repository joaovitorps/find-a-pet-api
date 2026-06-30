import { z } from "zod";
import { InvalidPhoneError } from "@/core/errors/invalid-phone-error";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { CreateOrgUseCase } from "@/domain/organization/application/use-cases/create-org";
import { makeOrg } from "@/test/factories/make-org";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";

let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: CreateOrgUseCase;

describe("Create Org Use Case", async () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new CreateOrgUseCase(inMemoryOrgRepository);
  });

  it("should create a organization", async () => {
    const { orgData } = await makeOrg();

    const { organization } = await sut.execute(orgData);

    expect(organization.email).toEqual(orgData.email);
    expect(z.safeParse(z.uuidv4(), organization.id.toString()).success).toBe(
      true,
    );
    expect(inMemoryOrgRepository.orgs).toHaveLength(1);
  });

  it("should fail on invalid phone number", async () => {
    const { orgData } = await makeOrg();

    await expect(() =>
      sut.execute({ ...orgData, phone: "++5511987654321" }),
    ).rejects.toBeInstanceOf(InvalidPhoneError);

    await expect(() =>
      sut.execute({ ...orgData, phone: "++5511987654321" }),
    ).rejects.toEqual(
      expect.objectContaining({ message: "Invalid phone number." }),
    );
    expect(inMemoryOrgRepository.orgs).toHaveLength(0);
  });

  it("should fail if org already exists (same name and phone)", async () => {
    const { orgData: orgData1 } = await makeOrg();
    const { orgData: orgData2 } = await makeOrg();

    await sut.execute(orgData1);

    await expect(() => sut.execute(orgData2)).rejects.toBeInstanceOf(
      ResourceAlreadyExistsError,
    );

    await expect(() => sut.execute(orgData2)).rejects.toEqual(
      expect.objectContaining({ message: "Resource already exists." }),
    );

    expect(inMemoryOrgRepository.orgs).toHaveLength(1);
  });

  it("should be different from received password", async () => {
    const { orgData } = await makeOrg();

    const { organization } = await sut.execute(orgData);

    expect(orgData.password).not.toEqual(organization.password);
  });

  it.todo("must not return the hash", async () => {});
});
