"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Post } from "../../module/post/domain/entities/post";
import { PostRepository } from "../../module/post/infrastructure/post.repository";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../../lib/global/global";
import { FindPostByTypeUseCase } from "../../module/post/application/usecases/find-post-byType.usecase";
import { MediaType } from "../../module/post/domain/enums/media-type";

const postRepo = new PostRepository();
const findAllPostUseCase = new FindPostByTypeUseCase(postRepo);

export function Info() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await findAllPostUseCase.execute(MediaType.IMAGE, 12, 1);
      setPosts(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const sliderPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const categories = useMemo(() => {
    const names = posts
      .map((p) => p.category?.name?.trim())
      .filter((name): name is string => !!name);
    return ["Tout", ...Array.from(new Set(names))];
  }, [posts]);

  const filteredNews = useMemo(() => {
    if (activeCategory === "Tout") return posts;
    return posts.filter((post) => post.category?.name?.trim() === activeCategory);
  }, [posts, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tout: posts.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = posts.filter((p) => p.category?.name?.trim() === cat).length;
    });
    return counts;
  }, [posts, categories]);

  useEffect(() => {
    if (sliderPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderPosts.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium tracking-wide">
            Chargement de l'univers Foody...
          </p>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">Aucun contenu disponible</p>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      {/* --- HERO SLIDER --- */}
      <div className="relative w-full overflow-hidden bg-black h-[450px] md:h-[550px] lg:h-[650px]">
        {sliderPosts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Gradient overlay with better depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

            {/* Image with Ken Burns effect */}
            <Image
              src={post.mediaUrl ?? "/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              style={{
                transform: index === currentIndex ? "scale(1)" : "scale(1.1)",
                transition: "transform 5s ease-out",
              }}
              priority={index === 0}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-20">
              <div className="container mx-auto max-w-7xl">
                <Link
                  href={`/module/post/view/page/${post.id}`}
                  className="group inline-block"
                >
                  {/* Badge */}
                  <span className="bg-orange-600 hover:bg-orange-700 transition-colors text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block rounded shadow-lg">
                    À la une
                  </span>

                  {/* Title */}
                  <h1 className="mb-6 text-3xl md:text-5xl lg:text-7xl font-serif italic text-white leading-[1.1] max-w-5xl group-hover:text-orange-400 transition-colors duration-300 drop-shadow-2xl">
                    {post.title}
                  </h1>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-white/80 text-xs md:text-sm font-bold uppercase tracking-widest">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="w-10 h-[2px] bg-orange-500"></span>
                    <span className="text-orange-500 group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                      Lire le récit
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {sliderPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-12 bg-orange-600"
                  : "w-6 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* --- NAVIGATION & FILTRES --- */}
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 border-b-2 border-gray-200 pb-10">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Journal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                Gastronomique
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base font-light tracking-wide">
              Découvrez nos dernières histoires culinaires
            </p>
          </div>

          {/* Category filters with counts */}
          <nav className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-full ${
                  activeCategory === cat
                    ? "text-white bg-orange-600 shadow-lg shadow-orange-600/30"
                    : "text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                }`}
              >
                {cat}
                {categoryCounts[cat] !== undefined && (
                  <span
                    className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
                      activeCategory === cat ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    {categoryCounts[cat]}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* --- GRID ACTUALITÉS --- */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {filteredNews.map((post) => (
              <Link
                href={`/module/post/view/page/${post.id}`}
                key={post.id}
                className="group block"
              >
                <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={post.mediaUrl ?? "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category badge on image */}
                    <span className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-lg">
                      {post.category?.name || "Magazine"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Date */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[11px] font-semibold uppercase tracking-wide">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl md:text-2xl font-serif italic text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors duration-300">
                      {post.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                      {post.content}
                    </p>

                    {/* Read more link */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-orange-600 transition-colors">
                        Lire l'article
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="max-w-md mx-auto space-y-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-gray-400 italic text-xl font-light">
                Aucune histoire à raconter dans cette rubrique pour le moment.
              </p>
              <p className="text-gray-500 text-sm">
                Catégorie sélectionnée : <strong>{activeCategory}</strong>
              </p>
              <button
                onClick={() => setActiveCategory("Tout")}
                className="text-orange-600 hover:text-orange-700 text-sm font-semibold underline underline-offset-4"
              >
                Voir tous les articles
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
