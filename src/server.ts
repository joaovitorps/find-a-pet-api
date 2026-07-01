import { createLogger, format, transports } from "winston";
import packageFile from "../package.json";
import { build } from "./app";
import { env } from "./env";

const httpTransportOptions = {
  host: "http-intake.logs.datadoghq.com",
  path: `/api/v2/logs?dd-api-key=${env.DATADOG_API_KEY}&ddsource=nodejs&service=${packageFile.name}`,
  ssl: true,
};

const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Http(httpTransportOptions)],
});

logger.on("error", (err) => {
  console.error(err);
});

const envToLogger = {
  dev: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const server = build({
  logger: envToLogger[env.NODE_ENV] ?? true,
});

server.listen({ port: env.PORT, host: "0.0.0.0" }, (_err, address) => {
  logger.log({
    level: "info",
    message: `😎 Server is running at ${address}`,
  });
});
