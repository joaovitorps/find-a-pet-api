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

server.listen({ port: env.PORT, host: "127.0.0.1" }, (_err, address) => {
  console.log(`😎 Server is running at ${address}`);
});
