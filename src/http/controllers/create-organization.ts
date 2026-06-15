import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceAlreadyExists } from "@/core/errors/resource-already-exists-error";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { CreateOrgUseCase } from "@/domain/organization/application/use-cases/create-org";

const RequestBodySchema = z.object({
  name: z.string(),
  phone: z.stringFormat("phone", /^\+55[1-9]{2}(?:[2-8]\d{7}|9\d{8})$/),
  address: z.object({
    number: z.string(),
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  }),
});

export const createOrganizationController = (orgRepo: OrgRepository) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, phone, address } = RequestBodySchema.parse(req.body);

    try {
      await new CreateOrgUseCase(orgRepo).execute({ name, phone, address });
    } catch (error) {
      if (error instanceof ResourceAlreadyExists) {
        return reply.code(409).send();
      }

      throw error;
    }

    return reply.code(201).send({ success: true });
  };
};
