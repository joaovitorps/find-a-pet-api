import type { FastifyRequest } from "fastify/types/request";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials";

export const verifyJWT = async (req: FastifyRequest) => {
  try {
    await req.jwtVerify();
    req.org = { id: req.user.sub };
  } catch (_) {
    throw new InvalidCredentialsError();
  }
};
