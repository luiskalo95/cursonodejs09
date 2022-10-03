import { IAuth } from './auth.factory';

export class AuthModel implements IAuth {
  constructor(public email: string, public password: string) {}
}
