import { DriverModel } from '../domain/models/driver.model';
import { DriverRepository } from '../domain/repositories/driver.repository';
import { BaseApplication } from '../../shared/application/interfaces/base-application';
import { DriverDTO } from './dtos/dto';
import Result from '../../shared/application/interfaces/result.interface';

export class DriverApplication extends BaseApplication<DriverModel> {
  constructor(private driverRepository: DriverRepository) {
    super(driverRepository, new DriverDTO(), 'DriverApplication');
  }

  async getAll(): Promise<Result<DriverModel>> {
    return await this.driverRepository.findAll({}, [], {});
  }

  async getReportByDriver(id: number): Promise<DriverModel[]> {
    return await this.driverRepository.reportByDriver(id);
  }
}
