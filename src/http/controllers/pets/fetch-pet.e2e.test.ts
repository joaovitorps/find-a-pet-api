import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("POST /organizations/:orgId/pets", async () => {
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

  it("should fetch all pets if requested city", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const dbOrg = await ctx.db.org.findFirstOrThrow();

    const { petParams: pet1 } = await makePet({
      orgId: new UniqueEntityID(dbOrg.id),
    });
    const { petParams: pet2 } = await makePet({
      orgId: new UniqueEntityID(dbOrg.id),
    });

    await ctx.app.inject({
      method: "POST",
      url: `/organizations/${dbOrg.id}/pets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: pet1,
    });

    await ctx.app.inject({
      method: "POST",
      url: `/organizations/${dbOrg.id}/pets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: pet2,
    });

    const response = await ctx.app.inject({
      method: "GET",
      url: `/pets?city=s%C3%A3o+Paulo`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(200);

    const data = await response.json();

    expect(data.pets).toBeDefined();
    expect(data.pets).toHaveLength(2);
  });

  it("should return 400 no match for the requested city", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const response = await ctx.app.inject({
      method: "GET",
      url: `/pets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(400);

    const data = await response.json();

    expect(data.issues[0].path[0]).toContain("city");
  });
});
