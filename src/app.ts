import express, { Application, Request, Response } from "express";
import RoutesUser from "./users/interfaces/http/users.route";
import RoutesDriver from "./drivers/interfaces/drivers.route";
import AuthRouter from "./auth/interfaces/auth.route";
import { HandlerErrors } from "./shared/helpers/errors.helper";
import { Authentication } from "./shared/middlewares/authentication.guard";
import { Authorization } from "./shared/middlewares/authorization.guard";

class App {
  expressApp: Application;

  constructor() {
    this.expressApp = express();
    this.mountMiddlewares();
    this.mountHealthCheck();
    this.mountRoutes();
    this.mountErrors();
  }

  mountMiddlewares(): void {
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true })); // request.body
    /*  this.expressApp.use((req, res, next) => {
      req.traceId = uuidv4();
      next();
    }); */
  }

  mountRoutes(): void {
    this.expressApp.use(
      "/users",
      Authentication.canActivate,
      Authorization.canActivate("ADMIN"),
      new RoutesUser().expressRouter
    );
    this.expressApp.use(
      "/drivers",
      Authentication.canActivate,
      Authorization.canActivate("ADMIN", "OPERATOR"),
      new RoutesDriver().expressRouter
    );
    this.expressApp.use("/auth", new AuthRouter().expressRouter);
  }

  mountHealthCheck(): void {
    this.expressApp.get("/", (req: Request, res: Response) => {
      res.send("All is good!");
    });

    this.expressApp.get("/healthcheck", (req, res) => {
      res.send("All is good!");
    });
  }

  mountErrors() {
    this.expressApp.use(HandlerErrors.notFound);
    this.expressApp.use(HandlerErrors.generic);
  }
}

export default new App().expressApp;
