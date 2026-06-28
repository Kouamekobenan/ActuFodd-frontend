import { api } from "../../../common/database/api";
import { CreateCategoryDto } from "../application/dtos/create-dto";
import { UpdateCategoryDto } from "../application/dtos/update-dto";
import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/interface/category.repository";

function mapCategory(raw: any): Category {
  return new Category(
    raw.id ?? raw._id ?? "",
    raw.name ?? raw._name ?? "",
    raw.description ?? raw._description ?? "",
    raw.createdAt ?? raw._createdAt ?? "",
    raw.updatedAt ?? raw._updatedAt ?? "",
  );
}

export class CategoryRepository implements ICategoryRepository {
  async create(dto: CreateCategoryDto): Promise<Category> {
    const res = await api.post("/categories", dto);
    return mapCategory(res.data.data);
  }

  async findAll(): Promise<Category[]> {
    const res = await api.get("/categories");
    const data: any[] = res.data.data ?? [];
    return data.map(mapCategory);
  }

  async findOne(id: string): Promise<Category> {
    const res = await api.get(`/categories/${id}`);
    return mapCategory(res.data.data);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const res = await api.patch(`/categories/${id}`, dto);
    return mapCategory(res.data.data);
  }
}
