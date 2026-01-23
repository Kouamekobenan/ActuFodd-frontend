import { ICategoryRepository } from "../../domain/interface/category.repository";

export class FindCategoryTendanceUsecase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}
    async execute() {
        return await this.categoryRepository.findTendaces();
    }
}