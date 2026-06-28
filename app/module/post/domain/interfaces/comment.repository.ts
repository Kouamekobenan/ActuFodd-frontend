import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { Comment } from "../entities/comment.entity";

export interface ICommentRepository {
  getByPost(postId: string, page: number, limit: number): Promise<IPaginatedResponse<Comment>>;
  add(postId: string, content: string): Promise<Comment>;
  delete(commentId: string): Promise<void>;
}
