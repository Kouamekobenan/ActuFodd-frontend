"use client";
import React from "react";
import CreatePostForm from "../components/PostForm";
import { CreatePostDTO } from "../../post/application/dtos/create-post.dto";
import { PostRepository } from "../../post/infrastructure/post.repository";
import { CreatePostUseCase } from "../../post/application/usecases/create-post.usecase";
import { Post } from "../../post/domain/entities/post";
import BarLaterale from "../components/BarLaterale";

const postRepository = new PostRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);

export default function AdminPostsPage() {
  const handleCreatePost = async (dto: CreatePostDTO, file: File | null): Promise<Post> => {
    try {
      const post = await createPostUseCase.execute(dto, file || undefined);
      return post;
    } catch (error) {
      console.error("Erreur dashboard:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BarLaterale />
      <main className="lg:ml-64 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8 py-6">
        <CreatePostForm onSubmitService={handleCreatePost} />
      </main>
    </div>
  );
}
