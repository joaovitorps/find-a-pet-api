import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";

export const healthRoutes = async (app: FastifyInstance) => {
  app.get("/health", async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      return reply.status(503).send({
        status: "error",
        database: "unreachable",
      });
    }

    return reply.status(200).send({
      status: "ok",
      database: "ok",
    });
  });
};
