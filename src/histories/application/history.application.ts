import { BaseApplication } from '../../shared/application/interfaces/base-application';
import { HistoryModel } from '../domain/models/history.model';
import { HistoryRepository } from '../domain/repositories/history.repository';

export class HistoryApplication extends BaseApplication<HistoryModel> {
  constructor(private historyRepository: HistoryRepository) {
    super(historyRepository);
  }

  async getReportByHistory(id: number): Promise<HistoryModel[]> {
    return await this.historyRepository.reportByHistory(id);
  }
}
