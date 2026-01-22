import { IPostRepository } from "../../domain/interfaces/post.repository";

export class FindAllPostUseCase {
  constructor(private readonly postRepo: IPostRepository) {}
  async execute(limit: number, page: number) {
    return await this.postRepo.findAll(limit, page);
  }
}
