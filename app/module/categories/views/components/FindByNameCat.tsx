"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  TrendingUp,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

// Imports internes (adaptés à votre architecture)
import { CategoryRepository } from "../../infrastructure/category.repository";
import { FindCategoryByName } from "../../application/usecases/find-category-byName.usecase";
import { Category } from "../../domain/entities/category.entity";
import { formatDate } from "../../../../lib/global/global";

// Initialisation des services (Hors du composant pour éviter les re-créations inutiles)
const categoryRepo = new CategoryRepository();
const findCategoryUseCase = new FindCategoryByName(categoryRepo);

/**
 * COMPOSANT : Carte de Post (Design Pro)
 */
const PostCard = ({ post }: { post: any }) => {
  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-64 w-full overflow-hidden">
        {post.mediaUrl ? (
          <Image
            src={post.mediaUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <TrendingUp className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Article
          </span>
          <span className="text-gray-400 text-xs flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {post.content}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <button className="text-orange-600 font-semibold text-sm inline-flex items-center group/btn">
            Lire la suite
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * COMPOSANT PRINCIPAL : CategoryName
 */
export default function CategoryName({ catName }: { catName: string }) {
  const [categoryData, setCategoryData] = useState<Category | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!catName) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await findCategoryUseCase.execute(catName);
      setCategoryData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [catName]); // Correction : dépend de catName

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return (
    <section className="min-h-screen bg-[#fafafa] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Dynamique */}
        <header className="relative mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 capitalize italic">
            {catName}
            <span className="text-orange-600">.</span>
          </h1>
          {categoryData?._description && (
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              {categoryData._description}
            </p>
          )}
          <div className="w-20 h-1.5 bg-orange-600 mx-auto mt-6 rounded-full" />
        </header>

        {/* Zone de Contenu */}
        <div className="relative">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-gray-200 rounded-2xl" />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <ErrorState message={error} onRetry={fetchCategory} />
          )}

          {!isLoading &&
            !error &&
            (!categoryData?._posts || categoryData._posts.length === 0) && (
              <EmptyState />
            )}

          {!isLoading && !error && categoryData?._posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {categoryData._posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Sous-composants restants avec un design affiné
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-100">
    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Oups !</h3>
    <p className="text-gray-500 mb-8">{message}</p>
    <button
      onClick={onRetry}
      className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 opacity-60">
    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <p className="text-xl text-gray-500">
      Aucun contenu trouvé dans cette catégorie.
    </p>
  </div>
);
