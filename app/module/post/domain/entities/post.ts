import { Categorie, Category } from "../../../categories/domain/entities/category.entity";
import { MediaType } from "../enums/media-type";

export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string | null,
    public mediaType: MediaType,
    public mediaUrl: string | null,
    public readonly categoryId: string | null,
    public readonly adminId: string,
    public readonly publishedAt: string,
    public readonly updatedAt: Date,
    public isPublished: boolean,
    public category?: Categorie,
  ) {}
}
