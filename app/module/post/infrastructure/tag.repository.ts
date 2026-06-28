import { api } from "../../../common/database/api";
import { IPaginatedResponse } from "../../../common/helpers/type-generique";
import { Tag } from "../domain/entities/tag.entity";
import { Post } from "../domain/entities/post";
import { ITagRepository } from "../domain/interfaces/tag.repository";

export class TagRepository implements ITagRepository {
  async getAll(): Promise<Tag[]> {
    const res = await api.get("/tags");
    return (res.data.data ?? []).map((t: any) => new Tag(t.id, t.name, t._count?.posts ?? 0));
  }

  async getPostsByTag(name: string, page: number, limit: number): Promise<IPaginatedResponse<Post>> {
    const res = await api.get(`/tags/${encodeURIComponent(name)}/posts`, { params: { page, limit } });
    const result = res.data.data;
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
      totalPages: result.totalPages ?? 0,
      limit: result.limit ?? limit,
      page: result.page ?? page,
    };
  }

  async setPostTags(postId: string, tags: string[]): Promise<string[]> {
    const res = await api.post(`/tags/${postId}`, { tags });
    return res.data.data ?? [];
  }
}
