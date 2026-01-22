import { Post } from "../../domain/entities/post";
import { IPostRepository } from "../../domain/interfaces/post.repository";
import { CreatePostDTO } from "../dtos/create-post.dto";
export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}
  async execute(dto: CreatePostDTO, file?: File): Promise<Post> {
    return this.postRepository.create(dto, file);
  }
}
