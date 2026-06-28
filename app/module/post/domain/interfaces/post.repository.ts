import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { CreatePostDTO } from "../../application/dtos/create-post.dto";
import { UpdatePostDTO } from "../../application/dtos/update-post.dto";
import { Post } from "../entities/post";
import { MediaType } from "../enums/media-type";

export interface IPostRepository {
  findAll(limit: number, page: number): Promise<IPaginatedResponse<Post>>;
  findType(type: MediaType, limit: number, page: number): Promise<IPaginatedResponse<Post>>;
  search(q: string, page: number, limit: number): Promise<IPaginatedResponse<Post>>;
  trending(limit: number): Promise<Post[]>;
  create(dto: CreatePostDTO, file?: File): Promise<Post>;
  update(id: string, dto: UpdatePostDTO, file?: File): Promise<Post>;
  publish(id: string, isPublished: boolean): Promise<Post>;
  findOne(id: string): Promise<Post>;
  delete(id: string): Promise<void>;
}
