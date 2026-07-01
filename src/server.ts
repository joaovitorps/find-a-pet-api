import { build } from "./app";
import { env } from "./env";

const server = build({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

server.listen({ port: env.PORT, host: "0.0.0.0" }, (_err, address) => {
  console.log(`😎 Server is running at ${address}`);
});
