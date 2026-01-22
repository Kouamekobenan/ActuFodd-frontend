"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PostRepository } from "../../module/post/infrastructure/post.repository";
import { FindAllPostUseCase } from "../../module/post/application/usecases/findAll-post.usecase";
import { Post } from "../../module/post/domain/entities/post";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../../lib/global/global";

const postRepo = new PostRepository();
const findAllPostUseCase = new FindAllPostUseCase(postRepo);

export default function NewInfo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const PAGE_LIMIT = 6; // On réduit un peu pour une pagination plus visible

  const fetchPostData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findAllPostUseCase.execute(PAGE_LIMIT, page);
      setPosts(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPostData();
    // Scroll en haut de section lors du changement de page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchPostData]);

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px]">
              Flux d'actualité
            </span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Dernières <span className="text-orange-600">Publications</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-md text-sm font-light">
            Explorez les dernières tendances, recettes et critiques
            gastronomiques partagées par notre communauté.
          </p>
        </div>

        {/* Grille d'articles ou Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            // Skeleton Loader simple
            Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Link
                href={`/module/post/view/page/${post.id}`}
                key={post.id}
                className="group"
              >
                <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={post.mediaUrl ?? "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 uppercase">
                        {post.category?.name || "Général"}
                      </span>
                    </div>
                  </div>

                  {/* Body Container */}
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                      {formatDate(post.publishedAt)}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-light line-clamp-3 mb-6">
                      {post.content}
                    </p>
                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                        Lire plus
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic">
              Aucun article pour le moment.
            </div>
          )}
        </div>

        {/* --- PAGINATION PRO --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-4 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              ←
            </button>

            <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-orange-600 text-white"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-4 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
