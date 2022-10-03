import { UserController } from './users.controller';
import { UserApplication } from '../../application/user.application';
import { UserInfrastructure } from '../adapters/user.infrastructure';
import { BaseRouter } from '../../../shared/interfaces/base-router';
import { RoleInfrastructure } from '../../../roles/infrastructure/role.infrastructure';
import CacheRedis from '../../../shared/helpers/cache.helper';
import { HandlerErrors } from '../../../shared/helpers/errors.helper';
import { Authentication } from '../../../shared/middlewares/authentication.guard';
import { Authorization } from '../../../shared/middlewares/authorization.guard';
import {
  FactoryAWS,
  FactoryAzure,
  FactoryGCP,
  IUploadImage,
} from '../../../shared/infrastructure/upload.middleware';
import { UploadBuilder } from '../../../shared/application/upload-builder';
import { Validators } from '../../../shared/middlewares/validate.middleware';
import { userSchemas } from './users.dto';

const userInfrastructure = new UserInfrastructure();
const roleInfrastructure = new RoleInfrastructure();
const userApplication = new UserApplication(
  userInfrastructure,
  roleInfrastructure
);
const userController = new UserController(userApplication);
const uploadMiddleware: IUploadImage = new FactoryAWS();

class UserRouter extends BaseRouter {
  constructor() {
    super(userController, 'user');
  }

  override mountRoutesCommons(): void {
    this.expressRouter.get(
      '/',
      Authentication.canActivate,
      Authorization.canActivate('ADMIN'),
      CacheRedis.handle(this.tagName),
      HandlerErrors.catchError(userController.list)
    );

    this.expressRouter.post(
      '/' /* , uploadMiddleware.save(new UploadBuilder().addFieldName("photo").addMaxFileSize(5000000).addDirectory("users/photos").addIsPublic(true).addMimeTypesAllowed(["image/jpeg", "image/png"]).build()), Validators.validate(userSchemas.INSERT) */,
      HandlerErrors.catchError(userController.add)
    );

    this.expressRouter.put(
      '/:id',
      Authentication.canActivate,
      Authorization.canActivate('ADMIN'),
      HandlerErrors.catchError(userController.update)
    );

    this.expressRouter.delete(
      '/:id',
      Authentication.canActivate,
      Authorization.canActivate('ADMIN'),
      HandlerErrors.catchError(userController.delete)
    );

    this.expressRouter.get(
      '/:id',
      Authentication.canActivate,
      Authorization.canActivate('ADMIN'),
      CacheRedis.handle(this.tagName),
      HandlerErrors.catchError(userController.listOne)
    );
  }
}

export default UserRouter;
