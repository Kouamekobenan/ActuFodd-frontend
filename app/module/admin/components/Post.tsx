"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostRepository } from "../../post/infrastructure/post.repository";
import { FindAllPostUseCase } from "../../post/application/usecases/findAll-post.usecase";
import { DeletePostUseCase } from "../../post/application/usecases/delete-post.usecase";
import { Post } from "../../post/domain/entities/post";
import { formatDate } from "../../../lib/global/global";

const postRepo = new PostRepository();
const findAllPostUseCase = new FindAllPostUseCase(postRepo);
const deletePostUseCase = new DeletePostUseCase(postRepo);

export default function PostAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const PAGE_LIMIT = 6;

  const fetchPostData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findAllPostUseCase.execute(PAGE_LIMIT, page);
      setPosts(response.data);
      setTotalPages(1);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPostData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchPostData]);

  const handleDelete = async (id: string) => {
    try {
      await deletePostUseCase.execute(id);
      setPosts(posts.filter((post) => post.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-4 sm:py-8 px-3 sm:px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Header Admin - FIX DÉBORDEMENT */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                  Gestion des Publications
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {posts.length} articles publiés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* View Toggle - RESPONSIVE */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    view === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    view === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* New Post Button - RESPONSIVE */}
              <Link
                href="/module/admin/posts"
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden xs:inline">Nouveau Post</span>
                <span className="xs:hidden">Nouveau</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${
                  view === "grid" ? "h-80 sm:h-96" : "h-28 sm:h-32"
                }`}
              >
                <div className="animate-pulse bg-gray-200 w-full h-full" />
              </div>
            ))}
          </div>
        ) : view === "grid" ? (
          /* Grid View - FIX DÉBORDEMENT */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={post.mediaUrl || "/placeholder.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className="bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-gray-900 truncate max-w-[150px] inline-block">
                      {post.category?.name || "Général"}
                    </span>
                  </div>
                </div>

                {/* Body - FIX DÉBORDEMENT */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-0">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 truncate">
                    {formatDate(post.publishedAt)}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 break-words">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow break-words">
                    {post.content}
                  </p>

                  {/* Actions - FIX DÉBORDEMENT */}
                  <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100 flex-shrink-0">
                    <Link
                      href={`/module/post/view/page/${post.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all min-w-0"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="truncate">Voir</span>
                    </Link>
                    {/* <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all flex-shrink-0"
                      title="Modifier"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link> */}
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all flex-shrink-0"
                      title="Supprimer"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View - FIX DÉBORDEMENT */
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6">
                  {/* Thumbnail - FIX DÉBORDEMENT */}
                  <div className="relative w-full sm:w-40 md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-gray-100">
                    <img
                      src={post.mediaUrl || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content - FIX DÉBORDEMENT */}
                  <div className="flex-grow flex flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                          <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-gray-700 truncate max-w-[120px] sm:max-w-none">
                            {post.category?.name || "Général"}
                          </span>
                          <span className="text-gray-400 text-xs font-semibold truncate">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 break-words">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 break-words">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions - FIX DÉBORDEMENT */}
                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 sm:pt-4">
                      <Link
                        href={`/module/post/view/page/${post.id}`}
                        className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Voir
                      </Link>
                      {/* <Link
                        href={`/module/admin/posts/edit/${post.id}`}
                        className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Modifier
                      </Link> */}
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="flex items-center gap-1.5 sm:gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination - FIX DÉBORDEMENT */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 px-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm disabled:hover:bg-white disabled:hover:text-gray-400 flex-shrink-0"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-x-auto max-w-[200px] sm:max-w-none">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                    page === i + 1
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm disabled:hover:bg-white disabled:hover:text-gray-400 flex-shrink-0"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        )}
      </div>

      {/* Modal - FIX DÉBORDEMENT */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Confirmer la suppression
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Cette action est irréversible
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Êtes-vous sûr de vouloir supprimer cet article ? Toutes les
              données associées seront perdues définitivement.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
