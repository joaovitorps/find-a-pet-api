import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT, host: "127.0.0.1" }, (_err, address) => {
  console.log(`😎 Server is running at ${address}`);
});
