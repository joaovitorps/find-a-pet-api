import type { FastifyInstance } from "fastify";
import { makeOrg } from "../factories/make-org";

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  const { orgData } = await makeOrg();

  await app.inject({
    method: "POST",
    url: "/api/organizations",
    body: {
      name: orgData.name,
      email: orgData.email,
      password: orgData.password,
      ownerName: orgData.ownerName,
      address: orgData.address,
      phone: orgData.phone,
    },
  });

  const authResponse = await app.inject({
    method: "POST",
    url: "/api/sessions",
    body: {
      email: orgData.email,
      password: orgData.password,
    },
  });

  const { token } = await authResponse.json();

  return { token, orgData };
}
