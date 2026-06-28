import { ITagRepository } from "../../domain/interfaces/tag.repository";
import { Tag } from "../../domain/entities/tag.entity";

export class GetTagsUseCase {
  constructor(private readonly tagRepo: ITagRepository) {}
  async execute(): Promise<Tag[]> {
    return this.tagRepo.getAll();
  }
}
