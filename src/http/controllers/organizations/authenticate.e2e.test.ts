import { makeOrg } from "@/test/factories/make-org";
import { setupE2E } from "@/test/setup-e2e";

describe("POST /sessions", async () => {
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

  it("should authenticate a org", async () => {
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
      url: "/sessions",
      body: {
        email: orgData.email,
        password: orgData.password,
      },
    });

    expect(response.headers["set-cookie"]?.includes("token")).toBe(true);
    expect(response.statusCode).toEqual(200);

    const body = await response.json();

    const dbOrg = await ctx.db.org.findFirstOrThrow();

    expect(body).toEqual(
      expect.objectContaining({
        org: { id: dbOrg.id, name: dbOrg.name },
        token: expect.any(String),
      }),
    );
  });
});
