import { MediaType } from "../../domain/enums/media-type";

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  mediaType?: MediaType;
  categoryId?: string;
  isPublished?: boolean;
  sourceUrl?: string;
}
