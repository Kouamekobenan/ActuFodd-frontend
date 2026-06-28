import { api } from "../../../common/database/api";
import { DashboardStats } from "../domain/entities/dashboard.entity";
import { IDashboardRepository } from "../domain/interfaces/dashboard.repository";

export class DashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const res = await api.get("/stats/dashboard");
    return res.data.data;
  }
}
