import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Age, Size } from "@/domain/pet/enterprise/entities/pet";
import { makePet } from "@/test/factories/make-pet";
import { setupE2E } from "@/test/setup-e2e";
import { createAndAuthenticateOrg } from "@/test/utils/create-and-authenticate-org";

describe("PUT /pets/:petId", async () => {
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

  it("should update a pet", async () => {
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
      method: "PUT",
      url: `/pets/${createdPet.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name: "Updated Buddy",
        about: "Updated about text",
        age: Age.ADULTO,
        size: Size.GRANDE,
      },
    });

    expect(response.statusCode).toEqual(204);

    const updatedPet = await ctx.db.pet.findFirstOrThrow();

    expect(updatedPet.name).toEqual("Updated Buddy");
    expect(updatedPet.about).toEqual("Updated about text");
    expect(updatedPet.age).toEqual("ADULTO");
    expect(updatedPet.size).toEqual("GRANDE");
  });

  it("should return 401 if not authenticated", async () => {
    const response = await ctx.app.inject({
      method: "PUT",
      url: "/pets/some-id",
      body: { name: "Test" },
    });

    expect(response.statusCode).toEqual(401);
  });

  it("should return 404 if pet does not exist", async () => {
    const { token } = await createAndAuthenticateOrg(ctx.app);

    const response = await ctx.app.inject({
      method: "PUT",
      url: "/pets/00000000-0000-0000-0000-000000000000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { name: "Test" },
    });

    expect(response.statusCode).toEqual(404);
  });

  it("should return 400 if passed a non-editable field along with a editable one", async () => {
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
      method: "PUT",
      url: `/pets/${createdPet.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id: "000-000-00",
        name: "Updated Buddy",
      },
    });

    expect(response.statusCode).toEqual(400);

    const body = await response.json();

    expect(body.cause).toHaveLength(1);
    expect(body.cause[0].code).toBe("unrecognized_keys");
    expect(body.cause[0].keys).toContain("id");

    const updatedPet = await ctx.db.pet.findFirstOrThrow();

    expect(updatedPet.id).toEqual(createdPet.id);
    expect(updatedPet.name).toEqual(createdPet.name);
  });
});
