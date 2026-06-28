import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { ITagRepository } from "../../domain/interfaces/tag.repository";
import { Post } from "../../domain/entities/post";

export class GetPostsByTagUseCase {
  constructor(private readonly tagRepo: ITagRepository) {}
  async execute(name: string, page = 1, limit = 10): Promise<IPaginatedResponse<Post>> {
    return this.tagRepo.getPostsByTag(name, page, limit);
  }
}
