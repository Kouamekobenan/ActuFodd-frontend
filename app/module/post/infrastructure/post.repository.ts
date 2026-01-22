import { api } from "../../../common/database/api";
import { IPaginatedResponse } from "../../../common/helpers/type-generique";
import { CreatePostDTO } from "../application/dtos/create-post.dto";
import { Post } from "../domain/entities/post";
import { IPostRepository } from "../domain/interfaces/post.repository";
export class PostRepository implements IPostRepository {
  async create(dto: CreatePostDTO, file?: File): Promise<Post> {
    let response;
    const url = `/posts`;
    try {
      if (file) {
        const formData = new FormData();
        formData.append("mediaUrl", file);
        // 2. Ajouter les autres champs du DTO
        formData.append("title", dto.title);
        formData.append("content", dto.content);
        formData.append("mediaType", dto.mediaType);
        formData.append("categoryId", dto.categoryId);
        formData.append("isPublished", (dto.isPublished ?? false).toString());
        // Si le backend nécessite adminId même si optional
        if (dto.adminId) {
          formData.append("adminId", dto.adminId);
        }
        // 3. Envoyer FormData (l'en-tête 'Content-Type: multipart/form-data' est souvent auto-géré)
        response = await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // const productPayload = this.mapper.toApp(dto);

        response = await api.post(url, dto);
      }

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Erreur Infrastructure (Repository) lors de la création du post:",
        error,
      );
      // Rejeter une erreur compréhensible par la couche Application/Domaine
      const message =
        error?.response?.data?.message ||
        "Erreur de connexion à l'API lors de la création.";
      throw new Error(message);
    }
  }
  async findAll(
    limit: number,
    page: number,
  ): Promise<IPaginatedResponse<Post>> {
    const url = "/posts";
    // Appel API
    const response = await api.get(url, {
      params: { limit, page },
    });
    // Axios met le corps de la réponse dans .data
    const result = response.data.data;
    return {
      data: Array.isArray(result) ? result : result.data || [],
      total: result.total || 0,
      totalPages: result.totalPages || 0,
      limit: result.limit || limit,
      page: result.page || page,
    };
  }
  async findOne(id: string): Promise<Post> {
    const url = `/posts/${id}`;
    const post = await api.get(url);
    return post.data.data;
  }
  async delete(id: string): Promise<void> {
    const url = `/posts/${id}`;
    await api.delete(url);
  }
}
