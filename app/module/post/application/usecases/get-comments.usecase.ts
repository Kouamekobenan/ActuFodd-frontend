import { IPaginatedResponse } from "../../../../common/helpers/type-generique";
import { ICommentRepository } from "../../domain/interfaces/comment.repository";
import { Comment } from "../../domain/entities/comment.entity";

export class GetCommentsUseCase {
  constructor(private readonly commentRepo: ICommentRepository) {}
  async execute(postId: string, page = 1, limit = 20): Promise<IPaginatedResponse<Comment>> {
    return this.commentRepo.getByPost(postId, page, limit);
  }
}
