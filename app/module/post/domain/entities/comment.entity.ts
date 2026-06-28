export class Comment {
  constructor(
    public id: string,
    public content: string,
    public postId: string,
    public adminId: string,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
