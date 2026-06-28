import { ITagRepository } from "../../domain/interfaces/tag.repository";

export class SetPostTagsUseCase {
  constructor(private readonly tagRepo: ITagRepository) {}
  async execute(postId: string, tags: string[]): Promise<string[]> {
    return this.tagRepo.setPostTags(postId, tags);
  }
}
