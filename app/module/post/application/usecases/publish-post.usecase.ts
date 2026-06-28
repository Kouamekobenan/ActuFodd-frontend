import { IPostRepository } from "../../domain/interfaces/post.repository";
import { Post } from "../../domain/entities/post";

export class PublishPostUseCase {
  constructor(private readonly postRepo: IPostRepository) {}
  async execute(id: string, isPublished: boolean): Promise<Post> {
    return this.postRepo.publish(id, isPublished);
  }
}
