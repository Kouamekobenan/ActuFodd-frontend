"use client";
import React from "react";
import BarLaterale from "../../components/BarLaterale";
import CreatePostForm from "../../components/PostForm";
import { CreatePostDTO } from "../../../post/application/dtos/create-post.dto";
import { PostRepository } from "../../../post/infrastructure/post.repository";
import { CreatePostUseCase } from "../../../post/application/usecases/create-post.usecase";
import { Post } from "../../../post/domain/entities/post";
import { useRouter } from "next/navigation";

const postRepository = new PostRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);

export default function NewPostPage() {
  const router = useRouter();

  const handleCreatePost = async (dto: CreatePostDTO, file: File | null): Promise<Post> => {
    const post = await createPostUseCase.execute(dto, file || undefined);
    router.push("/module/admin/posts");
    return post;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarLaterale />
      <main className="lg:ml-64 pb-24 lg:pb-8 px-4 sm:px-6 py-6">
        <CreatePostForm onSubmitService={handleCreatePost} />
      </main>
    </div>
  );
}
