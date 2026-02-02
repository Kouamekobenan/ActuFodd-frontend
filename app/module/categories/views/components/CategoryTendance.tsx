"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CategoryRepository } from "../../infrastructure/category.repository";
import { FindCategoryTendanceUsecase } from "../../application/usecases/find-category-tendance.usecase";
import { Category } from "../../domain/entities/category.entity";
import Image from "next/image";
import { formatDate } from "../../../../lib/global/global";
import { TrendingUp, Calendar, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const categoryRepo = new CategoryRepository();
const categoryTendance = new FindCategoryTendanceUsecase(categoryRepo);

// Composant de carte de post
const PostCard = ({ post }: { post: any }) => {
  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        {post.mediaUrl ? (
          <Image
            src={post.mediaUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-sm">Aucune image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <Link
          href={`/module/post/view/page/${post.id}`}
          className="group inline-block p-2 bg-orange-100 mt-2 rounded-2xl"
        >
          <div className="flex items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
            <span className="text-orange-500 group-hover:pl-2 transition-all">
              Lire le récit →
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
};

// Composant de chargement
const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
      <p className="text-gray-600 text-lg">Chargement des tendances...</p>
    </div>
  );
};

// Composant d'erreur
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertCircle className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Une erreur est survenue
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
      >
        Réessayer
      </button>
    </div>
  );
};
// Composant d'état vide
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <TrendingUp className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aucune tendance disponible
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Il n'y a pas de tendances à afficher pour le moment. Revenez plus tard !
      </p>
    </div>
  );
};

export default function CategoryTendance() {
  const [tendance, setTendance] = useState<Category | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await categoryTendance.execute();
      const categoryData = result;
      setTendance(categoryData);
    } catch (error) {
      console.error("Error fetching tendance category:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTendance();
  }, [fetchTendance]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Les Tendances
          </h1>
          {tendance && !isLoading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {tendance._description}
            </p>
          )}
        </header>

        {/* Contenu principal */}
        <div className="relative">
          {isLoading && <LoadingState />}

          {error && !isLoading && (
            <ErrorState message={error} onRetry={fetchTendance} />
          )}

          {!isLoading &&
            !error &&
            tendance &&
            (!tendance._posts || tendance._posts.length === 0) && (
              <EmptyState />
            )}

          {!isLoading &&
            !error &&
            tendance &&
            tendance._posts &&
            tendance._posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tendance._posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
