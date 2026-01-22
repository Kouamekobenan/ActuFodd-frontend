import { ICategoryRepository } from "../../domain/interface/category.repository";
import { UpdateCategoryDto } from "../dtos/update-dto";

export class UpdateCategoryUseCase {
  constructor(private readonly cateRepo: ICategoryRepository) {}
  async execute(id: string, update: UpdateCategoryDto) {
    return this.cateRepo.update(id, update);
  }
}
