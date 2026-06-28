import { RegisterDto } from "../../application/dtos/create-user.dto";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<void>;
}
