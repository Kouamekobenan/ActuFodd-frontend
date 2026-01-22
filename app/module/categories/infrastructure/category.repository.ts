import { api } from "../../../common/database/api";
import { CreateCategoryDto } from "../application/dtos/create-dto";
import { UpdateCategoryDto } from "../application/dtos/update-dto";
import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/interface/category.repository";

export class CategoryRepository implements ICategoryRepository {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const url = "/categories";
    const categories = await api.post(url, dto);
    return categories.data;
  }
  async findAll(): Promise<Category[]> {
    const url = "/categories";
    const categories = await api.get(url);
    return categories.data.data;
  }
  async findOne(id: string): Promise<Category> {
    const url = `categories/${id}`;
    return await api.get(url);
  }
  async delete(id: string): Promise<void> {
    const url = `/categories/${id}`;
    await api.delete(url);
  }
  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const url = `/categories/${id}`;
    const categories = await api.patch(url, dto);
    return categories.data;
  }
}
