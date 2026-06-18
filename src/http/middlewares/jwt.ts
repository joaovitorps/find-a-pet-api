import type { FastifyRequest } from "fastify/types/request";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";

export const verifyJWT = async (req: FastifyRequest) => {
  try {
    await req.jwtVerify();
  } catch (_) {
    throw new InvalidCredentialsError();
  }
};
