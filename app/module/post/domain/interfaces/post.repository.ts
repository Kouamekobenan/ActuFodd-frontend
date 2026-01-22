import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { CreatePostDTO } from "../../application/dtos/create-post.dto";
import { Post } from "../entities/post";

export interface IPostRepository {
  findAll(limit: number, page: number): Promise<IPaginatedResponse<Post>>;
  create(dto:CreatePostDTO, file?:File): Promise<Post>;
  findOne(id: string): Promise<Post>;
  delete(id: string): Promise<void>;
}
