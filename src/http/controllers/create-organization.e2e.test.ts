import { makeOrg } from "@/test/factories/make-org";
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
    const { newOrg } = makeOrg();

    const response = await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: {
        name: newOrg.name,
        email: newOrg.email,
        password: newOrg.password,
        ownerName: newOrg.ownerName,
        address: newOrg.address,
        phone: newOrg.phone,
      },
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should return 409 if org already exists", async () => {
    const { newOrg } = makeOrg();

    await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: {
        name: newOrg.name,
        email: newOrg.email,
        password: newOrg.password,
        ownerName: newOrg.ownerName,
        address: newOrg.address,
        phone: newOrg.phone,
      },
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/api/organization",
      body: {
        name: newOrg.name,
        email: newOrg.email,
        password: newOrg.password,
        ownerName: newOrg.ownerName,
        address: newOrg.address,
        phone: newOrg.phone,
      },
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
