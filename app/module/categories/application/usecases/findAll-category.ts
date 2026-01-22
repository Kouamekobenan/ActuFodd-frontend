import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/interface/category.repository";

export class FindAllCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(): Promise<Category[]> {
    return await this.categoryRepo.findAll();
  }
}
