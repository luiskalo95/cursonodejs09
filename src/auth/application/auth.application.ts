import { AuthModel } from '../domain/models/auth.model';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { TokensModel } from '../domain/models/tokens.model';
import Result from '../../shared/application/interfaces/result.interface';

export class AuthApplication {
  constructor(private authRepository: AuthRepository) {}

  login(auth: AuthModel): Promise<Result<TokensModel>> {
    return this.authRepository.login(auth);
  }

  getNewAccessToken(refreshToken: string): Promise<Result<TokensModel>> {
    return this.authRepository.getNewAccessToken(refreshToken);
  }
}
