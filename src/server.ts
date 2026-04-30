import fastify from "fastify";

export const app = fastify();

app.listen({ port: 3333, host: "127.0.0.1" }, (_err, address) => {
  console.log(`😎 Server is running at ${address}`);
});
