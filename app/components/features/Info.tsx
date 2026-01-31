"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Post } from "../../module/post/domain/entities/post";
import { PostRepository } from "../../module/post/infrastructure/post.repository";
import { FindAllPostUseCase } from "../../module/post/application/usecases/findAll-post.usecase";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../../lib/global/global";
import { FindPostByTypeUseCase } from "../../module/post/application/usecases/find-post-byType.usecase";
import { MediaType } from "../../module/post/domain/enums/media-type";

const postRepo = new PostRepository();
const findAllPostUseCase = new FindPostByTypeUseCase(postRepo);

const CATEGORIES = [
  "Tout",
  "Tendance",
  "Recettes",
  "Restaurant",
  "Portrait & Rencontre",
];

export function Info() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Tout");

  const fetchPostData = useCallback(async () => {
    const response = await findAllPostUseCase.execute(MediaType.IMAGE, 12, 1);
    setPosts(response.data);
  }, []);
  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  // Formatage de la date (Ex: 20 Janvier 2026)

  const sliderPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const filteredNews = useMemo(() => {
    const news = posts.slice(1);
    if (activeCategory === "Tout") return news;
    return news.filter((post) => post.category?.name === activeCategory);
  }, [posts, activeCategory]);

  useEffect(() => {
    if (sliderPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderPosts.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderPosts]);

  if (!posts.length)
    return (
      <div className="h-screen bg-white flex items-center justify-center text-gray-400">
        Chargement de l'univers Foody...
      </div>
    );
  return (
    <section className="bg-white">
      {/* --- HERO SLIDER --- */}
      <div className="relative w-full overflow-hidden bg-black h-[400px] md:h-[450px]">
        {sliderPosts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <Image
              src={post.mediaUrl ?? "/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-[5s] scale-110"
              style={{
                transform: index === currentIndex ? "scale(1)" : "scale(1.1)",
              }}
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-20 container mx-auto">
              <Link
                href={`/module/post/view/page/${post.id}`}
                className="group inline-block"
              >
                <span className="bg-orange-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block rounded-sm">
                  À la une
                </span>
                <h1 className="mb-6 text-4xl font-serif italic text-white md:text-6xl lg:text-7xl leading-[1.1] max-w-5xl group-hover:text-orange-400 transition-colors">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="w-10 h-[1px] bg-orange-500"></span>
                  <span className="text-orange-500 group-hover:pl-2 transition-all">
                    Lire le récit →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* --- NAVIGATION & FILTRES --- */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-gray-100 pb-8">
          <div className="mb-8 md:mb-0">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Journal <span className="text-orange-600">Gastronomique</span>
            </h2>
          </div>
          <nav className="flex flex-wrap gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-2 py-1 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? "text-orange-600"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-600 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
        {/* --- GRID ACTUALITÉS --- */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {filteredNews.map((post) => (
              <Link
                href={`/module/post/view/page/${post.id}`}
                key={post.id}
                className="group block"
              >
                <article className="flex flex-col h-full">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm mb-6 bg-gray-100">
                    <Image
                      src={post.mediaUrl ?? "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        {post.category?.name || "Magazine"}
                      </span>
                      <span className="text-gray-300 text-[10px]">—</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>

                    <h4 className="text-2xl font-serif italic text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                      {post.content}
                    </p>
                    <div className="mt-auto flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-2 w-fit">
                      Lire l'article <span className="text-orange-600">→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-gray-100 rounded-sm">
            <p className="text-gray-300 italic serif text-xl font-light">
              Aucune histoire à raconter dans cette rubrique pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
