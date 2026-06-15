import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { build } from "@/app";
import { createPrismaClient } from "@/infra/database/prisma/create-prisma-client";
import { PrismaOrgRepository } from "@/infra/database/prisma/repositories/prisma-org-repository";

const makeDatabaseUrl = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be specified.");
  }

  const dbUrl = new URL(process.env.DATABASE_URL);
  dbUrl.searchParams.set("schema", schema);

  // vi.stubEnv("DATABASE_URL", databaseUrl);

  return dbUrl.toString();
};

export async function setupE2E() {
  const schema = randomUUID();
  const databaseUrl = makeDatabaseUrl(schema);

  const db = createPrismaClient(databaseUrl);
  // await runMigrations(databaseUrl);
  //
  //

  //
  //
  //

  console.log(`[Test Environment] Using schema: ${process.env.DATABASE_URL}`);

  execSync("npx prisma migrate dev", {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  const app = build(
    {},
    {
      orgRepository: new PrismaOrgRepository(db),
    },
  );

  await app.ready();

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
      await db.org.deleteMany();
    },
  };
}
