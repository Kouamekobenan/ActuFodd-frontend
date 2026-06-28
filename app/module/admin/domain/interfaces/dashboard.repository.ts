import { DashboardStats } from "../entities/dashboard.entity";

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
}
