import { MediaType } from "../../domain/enums/media-type";
import { IPostRepository } from "../../domain/interfaces/post.repository";

export class FindPostByTypeUseCase {
  constructor(private postRepository: IPostRepository) {}
  async execute(type: MediaType, limit: number, page: number) {
    return this.postRepository.findType(type as MediaType, limit, page);
  }
}
