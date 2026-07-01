import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupE2E } from "@/test/setup-e2e";

let ctx: Awaited<ReturnType<typeof setupE2E>>;

beforeAll(async () => {
  ctx = await setupE2E();
});

afterAll(async () => {
  await ctx.cleanup();
});

describe("GET /health", () => {
  it("should return 200 with database ok", async () => {
    const response = await ctx.app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      status: "ok",
      database: "ok",
    });
  });
});
