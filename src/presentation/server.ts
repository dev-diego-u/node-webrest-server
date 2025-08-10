import express, { Router } from "express";
import path from "path";

export interface Options {
  port: number;
  publicPath?: string;
  routes: Router;
}

export class Server {
  private app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;
  constructor(options: Options) {
    const { port, routes, publicPath = "public" } = options;
    this.port = port;
    this.publicPath = publicPath;
    this.routes = routes;
  }

  /**
   * Devuelve la instancia de express app para pruebas (ej: supertest)
   */
  public getApp() {
    return this.app;
  }

  async start() {
    console.log("Starting server...");

    //*middleware
    this.app.use(express.json()); // For parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    //*public folder
    // 1. Web server: servir el frontend
    this.app.use(express.static(this.publicPath));

    // 2. API server: servir la API
    this.app.use(this.routes);

    // 3. Catch-all para SPA (React Router, etc.)
    this.app.get("{/*splat}", (req, res) => {
      console.log(req.url);
      const indexPath = path.resolve(
        __dirname,
        `../../${this.publicPath}/index.html`
      );
      console.log(indexPath);
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log("Server is listening on port 3000");
    });
  }

  public close() {
    if (this.serverListener) {
      this.serverListener.close();
    }
  }
}
