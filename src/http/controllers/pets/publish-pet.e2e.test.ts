import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("PATCH /pets/:petId/publish", async () => {
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

  it("should be able to publish a pet if is ADMIN", async () => {
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
      method: "PATCH",
      url: `/pets/${dbPet.id}/publish`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(204);

    const petDb = await ctx.db.pet.findFirstOrThrow();

    expect(petDb.status).toEqual("PUBLISHED");
  });
});
