import { envs } from "../src/config/envs";
import { Server } from "../src/presentation/server";

jest.mock("../src/presentation/server");

describe("Testing App.ts", () => {
  test("should work", async () => {
    await import("../src/app");
    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      publicPath: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    });
    expect(Server.prototype.start).toHaveBeenCalledTimes(1); // This line assumes that the start method is called in app.ts
  });
});
