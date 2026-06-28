import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { Tag } from "../entities/tag.entity";
import { Post } from "../entities/post";

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
  getPostsByTag(name: string, page: number, limit: number): Promise<IPaginatedResponse<Post>>;
  setPostTags(postId: string, tags: string[]): Promise<string[]>;
}
