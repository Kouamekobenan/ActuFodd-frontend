"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { formatDate } from "../../lib/global/global";
import { MediaType } from "../../module/post/domain/enums/media-type";
import { Post } from "../../module/post/domain/entities/post";
import { PostRepository } from "../../module/post/infrastructure/post.repository";
import { FindPostByTypeUseCase } from "../../module/post/application/usecases/find-post-byType.usecase";

const postRepo = new PostRepository();
const findPostByTypeUseCase = new FindPostByTypeUseCase(postRepo);

// --- Composants Internes ---

const PlayIcon = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-xl">
      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3 mt-16 pb-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-blue-200 shadow-lg scale-110"
                : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const [imageError, setImageError] = useState(false);
  const isVideo =
     MediaType.VIDEO || post.mediaUrl?.includes("video");

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
        {post.mediaUrl && !imageError ? (
          <>
            <Image
              src={post.mediaUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg
              className="w-12 h-12 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {isVideo && <PlayIcon />}
        <div className="absolute top-3 left-3 flex gap-2">
          {post.category && (
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-gray-800 rounded-lg shadow-sm">
              {post.category.name}
            </span>
          )}
          {isVideo && (
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
              Vidéo
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[2px] bg-blue-600"></span>
          <time className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
          {post.content || "Consultez les dernières informations sur ce post."}
        </p>
        <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-wider">
          <span className="mr-2 group-hover:mr-4 transition-all duration-300">
            En savoir plus
          </span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </article>
  );
};

// --- Main Component ---

export default function PostTypeComponent({ type }: { type: MediaType }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchPostByType = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await findPostByTypeUseCase.execute(type, 9, page); // 9 posts pour un grid 3x3 parfait
      setPosts(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, type]);

  useEffect(() => {
    fetchPostByType();
  }, [fetchPostByType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {type === MediaType.VIDEO ? "Contenus vidéo" : "Actualités"}
              <span className="text-orange-600">.</span>
            </h1>
          </div>
          {!isLoading && posts.length > 0 && (
            <div className="bg-gray-100 px-4 py-2 rounded-full text-[12px] font-bold text-gray-500 uppercase">
              {posts.length} publications disponibles
            </div>
          )}
        </div>
        {/* Content Logic */}
        {error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-red-500 font-medium">Une erreur est survenue.</p>
            <button
              onClick={fetchPostByType}
              className="mt-4 text-orange-600 underline"
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200/50 rounded-2xl aspect-[16/14] animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            Aucun contenu trouvé.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
