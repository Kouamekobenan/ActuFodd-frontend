import { MediaType } from "../../domain/enums/media-type";

export interface CreatePostDTO {
  title: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  categoryId: string;
  adminId: string;
  isPublished?: boolean;
  sourceUrl?: string;
}
