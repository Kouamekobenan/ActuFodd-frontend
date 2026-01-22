import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/interface/category.repository";

export class FindOneCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(id: string): Promise<Category> {
    return await this.categoryRepo.findOne(id);
  }
}
