import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/interface/category.repository";
import { CreateCategoryDto } from "../dtos/create-dto";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(dto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.create(dto);
  }
}
