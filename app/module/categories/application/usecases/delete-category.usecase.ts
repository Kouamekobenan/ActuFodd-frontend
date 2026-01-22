import { ICategoryRepository } from "../../domain/interface/category.repository";
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(id: string) {
    return await this.categoryRepo.delete(id);
  }
}
