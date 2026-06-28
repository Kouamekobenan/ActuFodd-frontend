"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Calendar, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../../../../common/database/api";
import { formatDate } from "../../../../lib/global/global";
import { Post } from "../../../post/domain/entities/post";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => (
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
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="p-6 flex flex-col grow">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {post.category?.name ?? "Article"}
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
        <Link href={`/module/post/view/page/${post.id}`}>
          <button className="text-orange-600 font-semibold text-sm inline-flex items-center group/btn">
            Lire la suite
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  </article>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-20 px-6 bg-white rounded-3xl shadow-sm border border-red-100">
    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
    <p className="text-xl text-gray-500 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
    >
      Réessayer
    </button>
  </div>
);

const EmptyState = ({ catName }: { catName: string }) => (
  <div className="text-center py-20 opacity-60">
    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <p className="text-xl text-gray-500">
      Aucun contenu trouvé dans la catégorie &quot;{catName}&quot;.
    </p>
  </div>
);

export default function CategoryName({ catName }: { catName: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!catName) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch a wide set of posts then filter client-side by category name.
      // The new API doesn't expose a per-category posts endpoint.
      const res = await api.get("/posts", { params: { page: 1, limit: 100 } });
      const allPosts: Post[] = res.data.data?.data ?? res.data.data ?? [];
      const filtered = allPosts.filter(
        (p) => p.category?.name?.toLowerCase() === catName.toLowerCase(),
      );
      setPosts(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [catName]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <section className="min-h-screen bg-[#fafafa] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="relative mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 capitalize italic">
            {catName}
            <span className="text-orange-600">.</span>
          </h1>
          <div className="w-20 h-1.5 bg-orange-600 mx-auto mt-6 rounded-full" />
        </header>

        <div className="relative">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          )}

          {error && !isLoading && (
            <ErrorState message={error} onRetry={fetchPosts} />
          )}

          {!isLoading && !error && posts.length === 0 && (
            <EmptyState catName={catName} />
          )}

          {!isLoading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
