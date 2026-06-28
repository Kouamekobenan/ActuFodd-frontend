import { api } from "../../../common/database/api";
import { RegisterDto } from "../application/dtos/create-user.dto";
import { IUserRepository } from "../domain/interface/user.repository";

export class UserRepository implements IUserRepository {
  async create(dto: RegisterDto): Promise<void> {
    await api.post("/auth/register", dto);
  }
}
