import { env } from "@/env";
import { createPrismaClient } from "@/infra/database/prisma/create-prisma-client";

const connectionString = env.DATABASE_URL;

const prisma = createPrismaClient(connectionString);

export { prisma };
