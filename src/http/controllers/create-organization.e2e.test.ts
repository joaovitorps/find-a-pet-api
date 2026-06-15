import { setupE2E } from "@/test/setup-e2e";

describe("POST /api/organization", async () => {
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

  it("should create a organization", async () => {
    const orgData = {
      name: "Animals Org",
      address: {
        number: "123",
        street: "Old Street",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      },
      phone: "+5511987654321",
    };

    const response = await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: orgData,
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should return 409 if org already exists", async () => {
    const orgData = {
      name: "Animals Org",
      address: {
        number: "123",
        street: "Old Street",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
      },
      phone: "+5511987654321",
    };

    await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: orgData,
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: orgData,
    });

    expect(response.statusCode).toEqual(409);
  });

  it("should return 400 if invalid body", async () => {
    const response = await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: {},
    });

    expect(response.statusCode).toEqual(400);
  });
});
