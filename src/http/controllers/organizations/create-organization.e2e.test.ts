import { makeOrg } from "@/test/factories/make-org";
import { setupE2E } from "@/test/setup-e2e";

describe("POST /organizations", async () => {
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
    const { orgData } = await makeOrg();

    const response = await ctx.app.inject({
      method: "POST",
      url: "/organizations",
      body: {
        name: orgData.name,
        email: orgData.email,
        password: orgData.password,
        ownerName: orgData.ownerName,
        address: orgData.address,
        phone: orgData.phone,
      },
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should return 409 if org already exists", async () => {
    const { orgData } = await makeOrg();

    await ctx.app.inject({
      method: "POST",
      url: "/organizations",
      body: {
        name: orgData.name,
        email: orgData.email,
        password: orgData.password,
        ownerName: orgData.ownerName,
        address: orgData.address,
        phone: orgData.phone,
      },
    });

    const response = await ctx.app.inject({
      method: "POST",
      url: "/organizations",
      body: {
        name: orgData.name,
        email: orgData.email,
        password: orgData.password,
        ownerName: orgData.ownerName,
        address: orgData.address,
        phone: orgData.phone,
      },
    });

    expect(response.statusCode).toEqual(409);
  });

  it("should return 400 if invalid body", async () => {
    const response = await ctx.app.inject({
      method: "POST",
      url: "/organizations",
      body: {},
    });

    expect(response.statusCode).toEqual(400);
  });
});
