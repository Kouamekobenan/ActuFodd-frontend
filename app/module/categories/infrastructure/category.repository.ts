import { api } from "../../../common/database/api";
import { CreateCategoryDto } from "../application/dtos/create-dto";
import { UpdateCategoryDto } from "../application/dtos/update-dto";
import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/interface/category.repository";

export class CategoryRepository implements ICategoryRepository {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const res = await api.post("/categories", dto);
    return res.data.data;
  }

  async findAll(): Promise<Category[]> {
    const res = await api.get("/categories");
    return res.data.data;
  }

  async findOne(id: string): Promise<Category> {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const res = await api.patch(`/categories/${id}`, dto);
    return res.data.data;
  }
}
