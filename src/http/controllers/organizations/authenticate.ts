import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { AuthenticateUseCase } from "@/domain/organization/application/use-cases/authenticate";

const RequestBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const authenticateController = (orgRepo: OrgRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = RequestBodySchema.parse(req.body);

    const { org } = await new AuthenticateUseCase(orgRepo).execute({
      email,
      password,
    });

    const token = await reply.jwtSign({
      sub: org.id,
    });

    reply.setCookie("token", token, {
      path: "/",
      secure: true, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
    });

    return reply.code(200).send({ org: { id: org.id, name: org.name }, token });
  };
};
