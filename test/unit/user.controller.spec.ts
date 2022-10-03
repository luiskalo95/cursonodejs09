import * as httpMock from "node-mocks-http";
import { UserApplicationMock } from "./repositories/mockUserApplication";
import RedisBootstrap from "../../src/bootstrap/redis.bootstrap";

let req: any, res: any, next: any;
let userApplicationMock: any, userControllerMock: any;
let redisBootstrap: RedisBootstrap;

describe("user controller", () => {

  beforeAll(async () => {
    redisBootstrap = new RedisBootstrap();
    await redisBootstrap.initialize();
  });

  afterAll(() => {
    redisBootstrap.getConnection().disconnect();
  });

  beforeEach(() => {
    req = httpMock.createResponse();
    res = httpMock.createResponse();
    next = null;
    userApplicationMock = new UserApplicationMock().getController();
    userControllerMock = userApplicationMock.getController();
  });

  it("list users", async () => {
    await userControllerMock.list(req, res);
    userApplicationMock.assert(res);
  }, 24 * 60 * 60 * 1000);
});
