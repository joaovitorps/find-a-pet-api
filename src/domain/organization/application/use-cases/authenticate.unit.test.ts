import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";
import { makeOrg } from "@/test/factories/make-org";
import { InMemoryOrgRepository } from "@/test/repositories/in-memory-org-repository";
import { Organization } from "../../enterprise/entities/organization";
import { AuthenticateUseCase } from "./authenticate";

let inMemoryOrgRepository: InMemoryOrgRepository;
let sut: AuthenticateUseCase;

describe("Login Use Case", async () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository();
    sut = new AuthenticateUseCase(inMemoryOrgRepository);
  });

  it("should be able to login with valid email and password", async () => {
    const { orgData, newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg.toDBCreateDTO());

    const { org } = await sut.execute({
      email: orgData.email,
      password: orgData.password,
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it("should throw InvalidCredentialsError on wrong email or password", async () => {
    const { orgData, newOrg } = await makeOrg();

    inMemoryOrgRepository.create(newOrg.toDBCreateDTO());

    await expect(
      sut.execute({
        email: orgData.email,
        password: "test",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    await expect(
      sut.execute({
        email: "test",
        password: orgData.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
