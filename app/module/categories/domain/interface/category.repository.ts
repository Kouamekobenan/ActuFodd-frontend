import { CreateCategoryDto } from "../../application/dtos/create-dto";
import { UpdateCategoryDto } from "../../application/dtos/update-dto";
import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findAll(): Promise<Category[]>;
  findOne(id: string): Promise<Category>;
  delete(id: string): Promise<void>;
  update(id: string, dto: UpdateCategoryDto): Promise<Category>;
  findTendaces(): Promise<Category>;
  findName(catName: string): Promise<Category>;
}
