import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { IPostRepository } from "../../domain/interfaces/post.repository";
import { Post } from "../../domain/entities/post";

export class SearchPostsUseCase {
  constructor(private readonly postRepo: IPostRepository) {}
  async execute(q: string, page = 1, limit = 10): Promise<IPaginatedResponse<Post>> {
    return this.postRepo.search(q, page, limit);
  }
}
