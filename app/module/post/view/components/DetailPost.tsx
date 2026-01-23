"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PostRepository } from "../../infrastructure/post.repository";
import { FindOnePostUseCase } from "../../application/usecases/findOne-post.usecase";
import { Post } from "../../domain/entities/post";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { formatDate } from "../../../../lib/global/global";
import { ChevronLeft, Clock, Share2, Tag } from "lucide-react";

const postRepo = new PostRepository();
const findOnePostUseCase = new FindOnePostUseCase(postRepo);

export default function DetailPost() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const fetchPostData = useCallback(async (postId: string) => {
    try {
      setIsLoading(true);
      const response = await findOnePostUseCase.execute(postId);
      setPost(response);
    } catch (error) {
      console.error("Erreur de récupération:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchPostData(id);
  }, [id, fetchPostData]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="text-center py-20 font-serif">Article introuvable.</div>
    );
  }
  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {" "}
      {/* Anti-débordement horizontal */}
      {/* 1. Navbar Sticky */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-900 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
          >
            <ChevronLeft size={14} /> Retour
          </button>
         
        </div>
      </nav>
      {/* 2. Header de l'article */}
      <header className="container mx-auto max-w-4xl px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <div className="space-y-4 md:space-y-6 text-left">
          <div className="flex items-center gap-3">
            <span className="bg-orange-600 text-white px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
              {post.category?.name || "Gastronomie"}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              <Clock size={12} /> 5 min
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl font-serif italic leading-tight text-gray-900 break-words">
            {post.title}
          </h1>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-900">
              Publié le
            </p>
            <p className="text-xs md:text-sm text-gray-500 font-light">
              {formatDate(post.publishedAt)}
            </p>
          </div>
        </div>
      </header>
      {/* 3. Image Principale */}
      <div className="container mx-auto max-w-6xl px-0 md:px-6 mb-10 md:mb-16">
        <div className="relative h-[300px] md:h-[600px] w-full overflow-hidden md:rounded-3xl shadow-xl bg-gray-50">
          <Image
            src={post?.mediaUrl || "/placeholder.jpg"}
            alt={post?.title || "Illustration"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      {/* 4. Corps de l'article */}
      <article className="container mx-auto max-w-3xl px-4 md:px-6 pb-20">
        <div className="prose prose-orange max-w-none">
          {/* Ajustement de la lettrine pour mobile */}
          <p
            className="text-lg md:text-2xl font-serif leading-relaxed text-gray-800 
            first-letter:text-5xl md:first-letter:text-7xl 
            first-letter:font-black first-letter:text-orange-600 
            first-letter:mr-2 md:first-letter:mr-3 
            first-letter:float-left first-letter:leading-none"
          >
            {post.content}
          </p>

          <div className="mt-10 p-6 md:p-8 bg-gray-50 rounded-2xl border-l-4 border-orange-500 italic font-serif text-gray-600 text-sm md:text-base">
            "La gastronomie est l'art d'utiliser la nourriture pour créer du
            bonheur." — ActuFoody Team
          </div>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
          {["Cuisine", "Découverte"].map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest"
            >
              <Tag size={10} /> {tag}
            </div>
          ))}
        </div>
      </article>
      {/* 5. Footer Social */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 md:mb-8 text-gray-400">
            Partagez cet article
          </h3>
          <div className="flex justify-center gap-6 md:gap-8">
            {["Twitter", "Facebook", "WhatsApp"].map((social) => (
              <button
                key={social}
                className="text-gray-500 hover:text-orange-600 transition-colors uppercase text-[9px] md:text-[10px] font-bold tracking-widest"
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
