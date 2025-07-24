import express from "express";
import path from "path";

export interface Options {
  port: number;
  publicPath?: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, publicPath = "public" } = options;
    this.port = port;
    this.publicPath = publicPath;
  }

  async start() {
    console.log("Starting server...");

    //*middleware
    //*public folder
    this.app.use(express.static(this.publicPath));

    this.app.get("{/*splat}", (req, res) => {
      console.log(req.url);
      const indexPath = path.resolve(
        __dirname,
        `../../${this.publicPath}/index.html`
      );
      console.log(indexPath);
      res.sendFile(indexPath);
    });

    this.app.listen(this.port, () => {
      console.log("Server is listening on port 3000");
    });
  }
}
