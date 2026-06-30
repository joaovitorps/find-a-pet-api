import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("GET /pets/mine", async () => {
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

  it("should fetch all pets from the authenticated org", async () => {
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
      url: "/pets",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: pet1,
    });

    await ctx.app.inject({
      method: "POST",
      url: "/pets",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: pet2,
    });

    const response = await ctx.app.inject({
      method: "GET",
      url: "/pets/mine",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toEqual(200);

    const data = await response.json();

    expect(data.pets).toBeDefined();
    expect(data.pets).toHaveLength(2);
  });

  it("should return 401 if not authenticated", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/pets/mine",
    });

    expect(response.statusCode).toEqual(401);
  });

  it("should only return pets from the authenticated org", async () => {
    const { token: token1 } = await createAndAuthenticateOrg(ctx.app);

    const dbOrg1 = await ctx.db.org.findFirstOrThrow();

    const { petParams: pet1 } = await makePet({
      orgId: new UniqueEntityID(dbOrg1.id),
    });
    
    await ctx.app.inject({
      method: "POST",
      url: "/pets",
      headers: {
        Authorization: `Bearer ${token1}`,
      },
      body: pet1,
    });

    // Create a second org with a different email
    const { orgData: org2Data } = await makeOrg({ email: "other@org.com" });

    await ctx.app.inject({
      method: "POST",
      url: "/organizations",
      body: {
        name: org2Data.name,
        email: org2Data.email,
        password: org2Data.password,
        ownerName: org2Data.ownerName,
        address: org2Data.address,
        phone: org2Data.phone,
      },
    });

    const authResponse2 = await ctx.app.inject({
      method: "POST",
      url: "/sessions",
      body: {
        email: org2Data.email,
        password: org2Data.password,
      },
    });

    const { token: token2 } = await authResponse2.json();

    const dbOrg2 = await ctx.db.org.findFirstOrThrow({
      where: { id: { not: dbOrg1.id } },
    });

    const { petParams: pet2 } = await makePet({
      orgId: new UniqueEntityID(dbOrg2.id),
    });

    await ctx.app.inject({
      method: "POST",
      url: "/pets",
      headers: {
        Authorization: `Bearer ${token2}`,
      },
      body: pet2,
    });

    // Fetch as org1 — should only see org1's pets
    const response = await ctx.app.inject({
      method: "GET",
      url: "/pets/mine",
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    });

    expect(response.statusCode).toEqual(200);

    const data = await response.json();

    expect(data.pets).toHaveLength(1);
    expect(data.pets[0].orgId).toEqual(dbOrg1.id)
  });
});
