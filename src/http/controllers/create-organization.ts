import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import type { OrgRepository } from "@/domain/organization/application/repositories/org-repository";
import { CreateOrgUseCase } from "@/domain/organization/application/use-cases/create-org";
import { Phone } from "@/domain/organization/enterprise/value-objects/phone";

const RequestBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  ownerName: z.string(),
  phone: z.stringFormat("phone", Phone.validationRegex),
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
    const { name, email, password, ownerName, phone, address } =
      RequestBodySchema.parse(req.body);

    try {
      await new CreateOrgUseCase(orgRepo).execute({
        name,
        email,
        password,
        ownerName,
        phone,
        address,
      });
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsError) {
        return reply.code(409).send();
      }

      throw error;
    }

    return reply.code(201).send({ success: true });
  };
};
