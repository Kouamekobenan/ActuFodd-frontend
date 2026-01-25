import { ICategoryRepository } from "../../domain/interface/category.repository";

export class FindCategoryByName {
  constructor(private readonly cateRepo: ICategoryRepository) {}
  async execute(catName: string) {
    return await this.cateRepo.findName(catName);
  }
}
