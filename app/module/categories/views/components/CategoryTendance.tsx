"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../../../../common/database/api";
import { formatDate } from "../../../../lib/global/global";
import { Post } from "../../../post/domain/entities/post";

const PostCard = ({ post }: { post: Post }) => (
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
          <TrendingUp className="w-10 h-10 text-gray-300" />
        </div>
      )}
      {post.views > 0 && (
        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
          {post.views} vues
        </span>
      )}
    </div>
    <div className="p-6">
      {post.category && (
        <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
          {post.category.name}
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.content}</p>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </div>
      <Link
        href={`/module/post/view/page/${post.id}`}
        className="inline-block px-4 py-2 bg-orange-100 rounded-2xl text-orange-600 font-semibold text-sm hover:bg-orange-200 transition-colors"
      >
        Lire le récit →
      </Link>
    </div>
  </article>
);

export default function CategoryTendance() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/posts/trending", { params: { limit: 9 } });
      setPosts(res.data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Les Tendances
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Les articles les plus consultés du moment
          </p>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Chargement des tendances...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Une erreur est survenue
            </h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
            <button
              onClick={fetchTrending}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Réessayer
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
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
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
