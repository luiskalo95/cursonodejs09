import Result from '../../../shared/application/interfaces/result.interface';
import { AuthModel } from '../../domain/models/auth.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { TokensModel } from '../../domain/models/tokens.model';
import DatabaseBootstrap from '../../../bootstrap/database.bootstrap';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../users/infrastructure/adapters/entities/user.entity';
import { PasswordService } from '../../../users/domain/services/password.service';
import { TokensService } from '../../../users/domain/services/tokens.service';
import { ResponseDto } from '../../../shared/application/interfaces/dtos/response.dto';
import { Trace } from '../../../shared/helpers/trace.helper';

export class AuthInfrastructure implements AuthRepository {
  async login({ email, password }: AuthModel): Promise<Result<TokensModel>> {
    const dataSource = DatabaseBootstrap.dataSource;
    const repository: Repository<UserEntity> =
      dataSource.getRepository(UserEntity);
    const user = await repository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (user) {
      const isPasswordValid = await PasswordService.compare(
        password,
        user.password
      );
      if (isPasswordValid) {
        const accessToken = TokensService.generateAccessToken({
          email: user.email,
          name: user.name,
          roles: user.roles.map((role) => role.roleName),
        });
        return ResponseDto(Trace.traceId(), {
          accessToken,
          refreshToken: user.refreshToken,
        });
      }
      throw new Error('The password typed is wrong');
    } else throw new Error('The user typed is incorrect');
  }

  async getNewAccessToken(refreshToken: string): Promise<Result<TokensModel>> {
    const dataSource = DatabaseBootstrap.dataSource;
    const repository: Repository<UserEntity> =
      dataSource.getRepository(UserEntity);
    const user = await repository.findOne({
      where: { refreshToken, active: true },
      relations: ['roles'],
    });
    if (user) {
      const tokens = TokensService.generateTokens({
        email: user.email,
        name: user.name,
        roles: user.roles.map((role) => role.roleName),
      });
      user.refreshToken = tokens.refreshToken;
      await repository.save(user);
      return ResponseDto(Trace.traceId(), tokens);
    }
    throw new Error('User is not found');
  }
}
