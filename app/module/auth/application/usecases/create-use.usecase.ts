import { IUserRepository } from "../../domain/interface/user.repository";
import { RegisterDto } from "../dtos/create-user.dto";

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}
  async execute(dto: RegisterDto): Promise<void> {
    return await this.userRepo.create(dto);
  }
}
