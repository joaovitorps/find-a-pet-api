import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("DELETE /pets/:petId", async () => {
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

  it("should delete a pet", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const dbOrg = await ctx.db.org.findFirstOrThrow();

    const { petParams } = await makePet({
      orgId: new UniqueEntityID(dbOrg.id),
    });

    await ctx.app.inject({
      method: "POST",
      url: "/pets",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petParams,
    });

    const createdPet = await ctx.db.pet.findFirstOrThrow();

    const response = await ctx.app.inject({
      method: "DELETE",
      url: `/pets/${createdPet.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(204);

    const deletedPet = await ctx.db.pet.findFirst({
      where: { id: createdPet.id },
    });

    expect(deletedPet).toBeNull();
  });

  it("should return 401 if not authenticated", async () => {
    const response = await ctx.app.inject({
      method: "DELETE",
      url: "/pets/some-id",
    });

    expect(response.statusCode).toEqual(401);
  });

  it("should return 404 if pet does not exist", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const response = await ctx.app.inject({
      method: "DELETE",
      url: "/pets/00000000-0000-0000-0000-000000000000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(404);
  });
});
