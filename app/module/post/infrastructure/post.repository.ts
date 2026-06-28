import { api } from "../../../common/database/api";
import { IPaginatedResponse } from "../../../common/helpers/type-generique";
import { CreatePostDTO } from "../application/dtos/create-post.dto";
import { UpdatePostDTO } from "../application/dtos/update-post.dto";
import { Post } from "../domain/entities/post";
import { MediaType } from "../domain/enums/media-type";
import { IPostRepository } from "../domain/interfaces/post.repository";

export class PostRepository implements IPostRepository {
  async findAll(limit: number, page: number): Promise<IPaginatedResponse<Post>> {
    const res = await api.get("/posts", { params: { limit, page } });
    const result = res.data.data;
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
      totalPages: result.totalPages ?? 0,
      limit: result.limit ?? limit,
      page: result.page ?? page,
    };
  }

  async findType(type: MediaType, limit: number, page: number): Promise<IPaginatedResponse<Post>> {
    const res = await api.get(`/posts/type/${type}`, { params: { limit, page } });
    const result = res.data.data;
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
      totalPages: result.totalPages ?? 0,
      limit: result.limit ?? limit,
      page: result.page ?? page,
    };
  }

  async search(q: string, page: number, limit: number): Promise<IPaginatedResponse<Post>> {
    const res = await api.get("/posts/search", { params: { q, page, limit } });
    const result = res.data.data;
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
      totalPages: result.totalPages ?? 0,
      limit: result.limit ?? limit,
      page: result.page ?? page,
    };
  }

  async trending(limit: number): Promise<Post[]> {
    const res = await api.get("/posts/trending", { params: { limit } });
    return res.data.data ?? [];
  }

  async findOne(id: string): Promise<Post> {
    const res = await api.get(`/posts/${id}`);
    return res.data.data;
  }

  async create(dto: CreatePostDTO, file?: File): Promise<Post> {
    try {
      const formData = new FormData();
      formData.append("title", dto.title);
      if (dto.content) formData.append("content", dto.content);
      formData.append("mediaType", dto.mediaType);
      if (dto.categoryId) formData.append("categoryId", dto.categoryId);
      formData.append("isPublished", (dto.isPublished ?? false).toString());
      if (file) formData.append("mediaUrl", file);
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Erreur lors de la création.");
    }
  }

  async update(id: string, dto: UpdatePostDTO, file?: File): Promise<Post> {
    try {
      const formData = new FormData();
      if (dto.title !== undefined) formData.append("title", dto.title);
      if (dto.content !== undefined) formData.append("content", dto.content);
      if (dto.mediaType !== undefined) formData.append("mediaType", dto.mediaType);
      if (dto.categoryId !== undefined) formData.append("categoryId", dto.categoryId);
      if (dto.isPublished !== undefined) formData.append("isPublished", dto.isPublished.toString());
      if (file) formData.append("mediaUrl", file);
      const res = await api.patch(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Erreur lors de la mise à jour.");
    }
  }

  async publish(id: string, isPublished: boolean): Promise<Post> {
    const res = await api.patch(`/posts/${id}/publish`, { isPublished });
    return res.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }
}
