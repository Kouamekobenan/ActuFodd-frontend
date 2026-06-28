import { MediaType } from "../enums/media-type";

export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string | null,
    public mediaType: MediaType,
    public mediaUrl: string | null,
    public readonly categoryId: string | null,
    public readonly adminId: string,
    public readonly publishedAt: string,
    public readonly updatedAt: string,
    public isPublished: boolean,
    public views: number = 0,
    public tags: string[] = [],
    public likesCount: number = 0,
    public commentsCount: number = 0,
    public category?: { id: string; name: string },
    public sourceUrl: string | null = null,
  ) {}
}
