import { api } from "../../../common/database/api";
import { RegisterDto } from "../application/dtos/create-user.dto";
import { IUserRepository } from "../domain/interface/user.repository";
import { User } from "../domain/user.entity";

export class UserRepository implements IUserRepository {
  async create(dto: RegisterDto): Promise<User> {
    const url = "/auth/register";
    const users = await api.post(url, dto);
    return users.data;
  }
}
