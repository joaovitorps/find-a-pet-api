import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  WEB_DOMAIN: z.string(),
});

const envParse = z.safeParse(envSchema, process.env);

if (!envParse.success) {
  console.error("error: ", z.treeifyError(envParse.error));

  throw new Error("❌ Error trying to load env vars!");
}

export const env = envParse.data;
