import { ICommentRepository } from "../../domain/interfaces/comment.repository";
import { Comment } from "../../domain/entities/comment.entity";

export class AddCommentUseCase {
  constructor(private readonly commentRepo: ICommentRepository) {}
  async execute(postId: string, content: string): Promise<Comment> {
    return this.commentRepo.add(postId, content);
  }
}
