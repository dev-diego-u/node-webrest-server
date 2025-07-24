import { envs } from "./config/envs";
import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {
  console.log("app.js");
  const server = new Server({
    port: envs.PORT,
    publicPath: envs.PUBLIC_PATH,
  });
  await server.start();
}
