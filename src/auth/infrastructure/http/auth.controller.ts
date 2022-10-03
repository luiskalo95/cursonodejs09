import { Trace } from '../../../shared/helpers/trace.helper';
import { Logger } from '../../../shared/helpers/logging.helper';
import { AuthApplication } from '../../application/auth.application';
import { Request, Response } from 'express';

export class AuthController {
  constructor(private authApplication: AuthApplication) {
    this.login = this.login.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    Logger.getLogger().info({
      typeElement: 'AuthController',
      typeAction: 'login',
      traceId: Trace.traceId(true),
      message: 'Login',
      query: JSON.stringify({ email, password }),
      datetime: new Date(),
    });
    const result = await this.authApplication.login({ email, password });
    res.json(result);
  }

  async getNewAccessToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.params;
    Logger.getLogger().info({
      typeElement: 'AuthController',
      typeAction: 'getNewAccessToken',
      traceId: Trace.traceId(true),
      message: 'Get new access token',
      query: JSON.stringify({ refreshToken }),
      datetime: new Date(),
    });
    const result = await this.authApplication.getNewAccessToken(refreshToken);
    res.json(result);
  }
}
