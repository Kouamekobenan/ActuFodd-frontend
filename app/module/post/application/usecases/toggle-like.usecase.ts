import { ILikeRepository } from "../../domain/interfaces/like.repository";

export class ToggleLikeUseCase {
  constructor(private readonly likeRepo: ILikeRepository) {}
  async execute(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    return this.likeRepo.toggle(postId);
  }
}
