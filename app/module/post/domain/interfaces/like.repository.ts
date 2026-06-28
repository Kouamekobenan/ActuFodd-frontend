export interface ILikeRepository {
  getLikesCount(postId: string): Promise<number>;
  toggle(postId: string): Promise<{ liked: boolean; likesCount: number }>;
}
