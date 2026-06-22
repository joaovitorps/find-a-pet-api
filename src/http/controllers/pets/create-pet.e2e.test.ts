import { randomUUID } from "node:crypto";
import { makeOrg } from "@/test/factories/make-org";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";

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

  it("should create a pet", async () => {
    const { orgData } = await makeOrg();

    await ctx.app.inject({
      method: "POST",
      url: "/api/organizations",
      body: {
        name: orgData.name,
        email: orgData.email,
        password: orgData.password,
        ownerName: orgData.ownerName,
        address: orgData.address,
        phone: orgData.phone,
      },
    });

    const authResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/sessions",
      body: {
        email: orgData.email,
        password: orgData.password,
      },
    });

    const { token } = await authResponse.json();

    const { petParams } = await makePet();

    const dbOrg = await ctx.db.org.findFirstOrThrow();

    const response = await ctx.app.inject({
      method: "POST",
      url: `/organizations/${dbOrg.id}/pets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petParams,
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should return 401 if org does not exist", async () => {
    const { petParams } = await makePet();

    const response = await ctx.app.inject({
      method: "POST",
      url: `/organizations/${randomUUID()}/pets`,
      body: petParams,
    });

    expect(response.statusCode).toEqual(401);
  });
});
