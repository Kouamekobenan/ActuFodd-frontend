import { ICommentRepository } from "../../domain/interfaces/comment.repository";

export class DeleteCommentUseCase {
  constructor(private readonly commentRepo: ICommentRepository) {}
  async execute(commentId: string): Promise<void> {
    return this.commentRepo.delete(commentId);
  }
}
