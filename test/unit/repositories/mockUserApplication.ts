import { UserApplication } from "../../../src/users/application/user.application";
import mockUsers from "../mocks/users.json";
import { RoleInfrastructure } from "../../../src/roles/infrastructure/role.infrastructure";
import { UserInfrastructure } from "../../../src/users/infrastructure/adapters/user.infrastructure";
import { UserController } from "../../../src/users/infrastructure/http/users.controller";

export class UserApplicationMock {

  private userInfrastructure: any;
  private roleInfrastructure: any;

  constructor() {
    (UserApplication as jest.Mock) = jest.fn().mockReturnValue({
      findAll: jest.fn().mockResolvedValue(mockUsers),
    });

    (UserInfrastructure as jest.Mock) = jest.fn().mockReturnValue({
      findAll: jest.fn().mockResolvedValue(mockUsers),
    });

    (RoleInfrastructure as any) = jest.fn().mockReturnValue({
      findByIds: jest.fn(),
    });
  }

  getController() {
    this.userInfrastructure = new UserInfrastructure();
    this.roleInfrastructure = new RoleInfrastructure();
    const userApplication = new UserApplication(this.userInfrastructure, this.roleInfrastructure);
    return new UserController(userApplication);
  }

  assert(res: any) {
    const result = res._getJSONData();
    expect(res.statusCode).toBe(200);
    //expect(result).toEqual(mockUsers);
  }
}
