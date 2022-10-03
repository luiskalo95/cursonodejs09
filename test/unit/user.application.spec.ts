import { UserImplementsMock } from "./repositories/mockUserImplements";
import { UserApplication } from "../../src/users/application/user.application";
import { UserRepository } from "../../src/users/domain/repositories/user.repository";
import { RoleInfrastructure } from "../../src/roles/infrastructure/role.infrastructure";

let userImplementsMock: any, userApplication: any;

describe("user.application", () => {

  beforeEach(() => {
    userImplementsMock = new UserImplementsMock();
    userApplication = userImplementsMock.getApplication();
  });

  it("list users", async () => {
    const response = await userApplication.findAll({}, [], {});
    userImplementsMock.assert(response);
  });
});
