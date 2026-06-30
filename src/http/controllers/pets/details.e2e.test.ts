import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("POST /pets/:petId", async () => {
  let ctx: Awaited<ReturnType<typeof setupE2E>>;

  beforeAll(async () => {
    ctx = await setupE2E();
  });

  beforeEach(async () => {
    await ctx.reset();
  });

  afterAll(async () => {
    await ctx.cleanup();
  });

  it("should get the details of a specific pet", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const dbOrg = await ctx.db.org.findFirstOrThrow();

    const { petParams } = await makePet({
      orgId: new UniqueEntityID(dbOrg.id),
    });

    await ctx.app.inject({
      method: "POST",
      url: `/pets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petParams,
    });

    const dbPet = await ctx.db.pet.findFirstOrThrow();

    const response = await ctx.app.inject({
      method: "GET",
      url: `/pets/${dbPet.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(200);

    const data = await response.json();

    expect(data.pet).toEqual(
      expect.objectContaining({
        name: "Buddy",
        about: "A friendly dog",
        status: "DRAFT",
        age: "FILHOTE",
        size: "MEDIO",
        energyLevel: "ALTO",
        independencyLevel: "BAIXO",
        environment: "APARTAMENTO",
        pictures: ["image1.jpg"],
        adoptionRequirements: ["daily walks"],
      }),
    );

    expect(data.pet.id).toEqual(expect.any(String));
    expect(data.pet.orgId).toEqual(expect.any(String));
    expect(data.pet.createdAt).toEqual(expect.any(String));
    expect(data.pet.updatedAt).toEqual(expect.any(String));

    expect(data.org).toEqual({
      name: dbOrg.name,
      phone: dbOrg.phone,
    });
  });
});
