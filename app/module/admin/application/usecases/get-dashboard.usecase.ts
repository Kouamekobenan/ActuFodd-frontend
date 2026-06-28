import { DashboardStats } from "../../domain/entities/dashboard.entity";
import { IDashboardRepository } from "../../domain/interfaces/dashboard.repository";

export class GetDashboardUseCase {
  constructor(private readonly repo: IDashboardRepository) {}
  async execute(): Promise<DashboardStats> {
    return this.repo.getStats();
  }
}
