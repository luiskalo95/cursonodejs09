import { RoleRepository } from '../../roles/domain/repositories/role.repository';
import Result from '../../shared/application/interfaces/result.interface';
import { BaseApplication } from '../../shared/application/interfaces/base-application';
import { UserModel } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserDTO } from './dtos/dto';

export class UserApplication extends BaseApplication<UserModel> {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {
    super(userRepository, new UserDTO(), 'UserApplication');
  }

  override async add(userModel: UserModel): Promise<Result<UserModel>> {
    if (userModel.roles.length > 0) {
      const roles = await this.roleRepository.findByIds(
        userModel.roles as number[]
      );
      userModel.roles = roles;
    } else {
      delete userModel.roles;
    }
    const result = await this.userRepository.insert(userModel);
    return new UserDTO().mapping(result);
  }
}
