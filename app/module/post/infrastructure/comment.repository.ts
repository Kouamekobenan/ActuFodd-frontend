import { api } from "../../../common/database/api";
import { IPaginatedResponse } from "../../../common/helpers/type-generique";
import { Comment } from "../domain/entities/comment.entity";
import { ICommentRepository } from "../domain/interfaces/comment.repository";

export class CommentRepository implements ICommentRepository {
  async getByPost(postId: string, page: number, limit: number): Promise<IPaginatedResponse<Comment>> {
    const res = await api.get(`/posts/${postId}/comments`, { params: { page, limit } });
    const result = res.data.data;
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
      totalPages: result.totalPages ?? 0,
      limit: result.limit ?? limit,
      page: result.page ?? page,
    };
  }

  async add(postId: string, content: string): Promise<Comment> {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    return res.data.data;
  }

  async delete(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  }
}
