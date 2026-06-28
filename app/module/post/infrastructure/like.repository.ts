import { api } from "../../../common/database/api";
import { ILikeRepository } from "../domain/interfaces/like.repository";

export class LikeRepository implements ILikeRepository {
  async getLikesCount(postId: string): Promise<number> {
    const res = await api.get(`/posts/${postId}/likes`);
    return res.data.data.likesCount ?? 0;
  }

  async toggle(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data.data;
  }
}
