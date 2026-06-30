import { randomUUID } from "node:crypto";
import { makeOrg } from "@/test/factories/make-org";
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

  it("should create a pet", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

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
