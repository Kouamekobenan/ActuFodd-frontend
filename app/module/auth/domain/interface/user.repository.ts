import { RegisterDto } from "../../application/dtos/create-user.dto";
import { User } from "../user.entity";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<User>;
}
