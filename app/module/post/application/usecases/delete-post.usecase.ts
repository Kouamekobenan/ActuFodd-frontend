import { IPostRepository } from "../../domain/interfaces/post.repository";

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}
  async execute(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
