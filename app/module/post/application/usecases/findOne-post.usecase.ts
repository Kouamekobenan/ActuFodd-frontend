import { IPostRepository } from "../../domain/interfaces/post.repository";

export class FindOnePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}
  async execute(id: string) {
    return await this.postRepository.findOne(id);
  }
}
