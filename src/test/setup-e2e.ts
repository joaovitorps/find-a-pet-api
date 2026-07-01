import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { build } from "@/app";
import type { PrismaClient } from "@/generated/prisma/client";
import { createPrismaClient } from "@/infra/database/prisma/create-prisma-client";
import { PrismaOrgRepository } from "@/infra/database/prisma/repositories/prisma-org-repository";
import { PrismaPetRepository } from "@/infra/database/prisma/repositories/prisma-pet-repository";

const makeDatabaseUrl = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be specified.");
  }

  const dbUrl = new URL(process.env.DATABASE_URL);
  dbUrl.searchParams.set("schema", schema);
  const stringDbUrl = dbUrl.toString();

  vi.stubEnv("DATABASE_URL", stringDbUrl);

  return stringDbUrl;
};

const runMigrations = () => {
  execSync("npx prisma migrate deploy");
};

const createApp = async (db: PrismaClient) => {
  const app = build(
    {},
    {
      orgRepository: new PrismaOrgRepository(db),
      petRepository: new PrismaPetRepository(db),
    },
  );

  await app.ready();

  return app;
};

export async function setupE2E() {
  const schema = randomUUID();
  const databaseUrl = makeDatabaseUrl(schema);

  const db = createPrismaClient(databaseUrl);
  runMigrations();

  const app = await createApp(db);

  return {
    app,
    db,
    schema,
    async cleanup() {
      await app.close();
      await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await db.$disconnect();
    },
    async reset() {
      await db.pet.deleteMany();
      await db.org.deleteMany();
    },
  };
}
