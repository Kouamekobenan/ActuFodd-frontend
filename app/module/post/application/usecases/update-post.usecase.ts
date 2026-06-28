import { IPostRepository } from "../../domain/interfaces/post.repository";
import { UpdatePostDTO } from "../dtos/update-post.dto";
import { Post } from "../../domain/entities/post";

export class UpdatePostUseCase {
  constructor(private readonly postRepo: IPostRepository) {}
  async execute(id: string, dto: UpdatePostDTO, file?: File): Promise<Post> {
    return await this.postRepo.update(id, dto, file);
  }
}
