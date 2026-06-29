"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Tag,
  Send,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import { PostRepository } from "../../infrastructure/post.repository";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { LikeRepository } from "../../infrastructure/like.repository";
import { FindOnePostUseCase } from "../../application/usecases/findOne-post.usecase";
import { GetCommentsUseCase } from "../../application/usecases/get-comments.usecase";
import { AddCommentUseCase } from "../../application/usecases/add-comment.usecase";
import { DeleteCommentUseCase } from "../../application/usecases/delete-comment.usecase";
import { ToggleLikeUseCase } from "../../application/usecases/toggle-like.usecase";

import { Post } from "../../domain/entities/post";
import { Comment } from "../../domain/entities/comment.entity";
import { formatDate } from "../../../../lib/global/global";
import { useAuth } from "../../../../context/AuthContext";

// ── Singletons ────────────────────────────────────────────────────────────────
const postRepo = new PostRepository();
const commentRepo = new CommentRepository();
const likeRepo = new LikeRepository();

const findOnePost = new FindOnePostUseCase(postRepo);
const getComments = new GetCommentsUseCase(commentRepo);
const addComment = new AddCommentUseCase(commentRepo);
const deleteComment = new DeleteCommentUseCase(commentRepo);
const toggleLike = new ToggleLikeUseCase(likeRepo);

// ── Sub-components ────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  currentUserId,
  isSuperAdmin,
  onDelete,
}: {
  comment: Comment;
  currentUserId?: string;
  isSuperAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const canDelete = isSuperAdmin || comment.adminId === currentUserId;
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
        <span className="text-orange-600 font-bold text-xs">
          {comment.adminId.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 wrap-break-word">{comment.content}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── ShareBar ──────────────────────────────────────────────────────────────────

function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  // Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  // WhatsApp
  const shareOnWhatsApp = () => {
    const text = `${title} — ${getUrl()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Instagram : Web Share API sur mobile, copie du lien sur desktop
  const shareOnInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: getUrl() });
      } catch {
        // user cancelled — silent
      }
    } else {
      // Desktop : copier le lien pour le coller dans Instagram
      await navigator.clipboard.writeText(getUrl());
      toast.success("Lien copié ! Colle-le dans ta bio ou story Instagram.");
    }
  };

  // Copy link
  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    toast.success("Lien copié dans le presse-papiers !");
    setTimeout(() => setCopied(false), 2500);
  };

  const BUTTONS = [
    {
      label: "Facebook",
      action: shareOnFacebook,
      bg: "hover:bg-blue-600",
      border: "hover:border-blue-600",
      color: "hover:text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      action: shareOnWhatsApp,
      bg: "hover:bg-green-500",
      border: "hover:border-green-500",
      color: "hover:text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
    {
      label: "Instagram",
      action: shareOnInstagram,
      bg: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400",
      border: "hover:border-pink-500",
      color: "hover:text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-10 md:py-14 border-t border-gray-100">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400">
          Partagez cet article
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {BUTTONS.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm transition-all ${btn.bg} ${btn.border} ${btn.color}`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}

          {/* Copy link */}
          <button
            onClick={copyLink}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
              copied
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            }`}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {copied ? "Copié !" : "Copier le lien"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function DetailPost() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Post
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // Likes
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch post (increments views) ──────────────────────────────────────────
  const fetchPost = useCallback(async (postId: string) => {
    try {
      setLoadingPost(true);
      const data = await findOnePost.execute(postId);
      setPost(data);
      setLikesCount(data.likesCount);
    } catch {
      toast.error("Article introuvable.");
    } finally {
      setLoadingPost(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id, fetchPost]);

  // ── Fetch comments ──────────────────────────────────────────────────────────
  const fetchComments = useCallback(async (postId: string, page: number) => {
    setCommentsLoading(true);
    try {
      const res = await getComments.execute(postId, page, 20);
      setComments(page === 1 ? res.data : (prev) => [...prev, ...res.data]);
      setCommentsTotal(res.total);
      setCommentsTotalPages(res.totalPages);
      setCommentsPage(page);
    } catch {
      // silent
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchComments(id, 1);
  }, [id, fetchComments]);

  // ── Like toggle ─────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour liker cet article.");
      return;
    }
    setLikeLoading(true);
    try {
      const res = await toggleLike.execute(id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      toast.error("Erreur lors du like.");
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Add comment ─────────────────────────────────────────────────────────────
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour commenter.");
      return;
    }
    setSubmittingComment(true);
    try {
      const newComment = await addComment.execute(id, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentsTotal((t) => t + 1);
      setCommentText("");
      if (post) setPost({ ...post, commentsCount: post.commentsCount + 1 });
    } catch (err: any) {
      toast.error(err.message ?? "Erreur lors de l'envoi du commentaire.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ── Delete comment ──────────────────────────────────────────────────────────
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.execute(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCommentsTotal((t) => Math.max(0, t - 1));
      if (post) setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) });
      toast.success("Commentaire supprimé.");
    } catch (err: any) {
      toast.error(err.message ?? "Erreur lors de la suppression.");
    }
  };

  // ── Loading / 404 ───────────────────────────────────────────────────────────
  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 font-serif text-gray-500">
        Article introuvable.
      </div>
    );
  }

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {/* Navbar sticky */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-900 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
          >
            <ChevronLeft size={14} /> Retour
          </button>

          {/* Stats rapides */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {/* <span className="flex items-center gap-1">
              <Eye size={13} /> {post.views}
            </span> */}
            <span className="flex items-center gap-1">
              <Heart size={13} className={liked ? "fill-red-500 text-red-500" : ""} />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} /> {post.commentsCount}
            </span>
          </div>
        </div>
      </nav>

      {/* Header article */}
      <header className="container mx-auto max-w-4xl px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <div className="space-y-4 md:space-y-6 text-left">
          <div className="flex items-center gap-3 flex-wrap">
            {post.category && (
              <span className="bg-orange-600 text-white px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                {post.category.name}
              </span>
            )}
            <div className="flex items-center gap-2 text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              <Clock size={12} />
              {formatDate(post.publishedAt)}
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl font-serif italic leading-tight text-gray-900 wrap-break-word">
            {post.title}
          </h1>

          {/* Compteurs enrichis */}
          <div className="flex items-center gap-5 pt-2 text-sm text-gray-500">
            {/* <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-gray-400" />
              {post.views} vue{post.views > 1 ? "s" : ""}
            </span> */}
            <span className="flex items-center gap-1.5">
              <Heart size={15} className="text-gray-400" />
              {likesCount} like{likesCount > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={15} className="text-gray-400" />
              {post.commentsCount} commentaire{post.commentsCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </header>

      {/* Image principale */}
      {post.mediaUrl && post.mediaType === "IMAGE" && (
        <div className="container mx-auto max-w-6xl px-0 md:px-6 mb-10 md:mb-16">
          <div className="relative h-75 md:h-150 w-full overflow-hidden md:rounded-3xl shadow-xl bg-gray-50">
            <Image
              src={post.mediaUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Vidéo principale */}
      {post.mediaUrl && post.mediaType === "VIDEO" && (
        <div className="container mx-auto max-w-6xl px-0 md:px-6 mb-10 md:mb-16">
          <video
            src={post.mediaUrl}
            controls
            className="w-full md:rounded-3xl shadow-xl bg-black"
          />
        </div>
      )}

      {/* Corps de l'article */}
      <article className="container mx-auto max-w-3xl px-4 md:px-6 pb-12">
        {post.content && (
          <div className="prose prose-orange max-w-none mb-10">
            <style>{`
              .article-body h1 { font-size: 1.9rem; font-weight: 800; margin: 1.5rem 0 0.75rem; color: #111827; line-height: 1.15; }
              .article-body h2 { font-size: 1.45rem; font-weight: 700; margin: 1.25rem 0 0.6rem; color: #1f2937; }
              .article-body h3 { font-size: 1.15rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #374151; }
              .article-body p  { font-size: 1.125rem; line-height: 1.9; color: #374151; margin: 0.85rem 0; font-family: Georgia, serif; }
              .article-body p:first-child::first-letter {
                font-size: 3.5rem; font-weight: 800; float: left; line-height: 0.8;
                margin-right: 0.15rem; margin-top: 0.1rem; color: #ea580c; font-family: Georgia, serif;
              }
              .article-body strong { font-weight: 700; color: #111827; }
              .article-body em { font-style: italic; color: #4b5563; }
              .article-body u { text-decoration: underline; text-decoration-color: #fdba74; text-underline-offset: 3px; }
              .article-body s { text-decoration: line-through; color: #9ca3af; }
              .article-body ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
              .article-body ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
              .article-body li { font-size: 1.05rem; line-height: 1.75; color: #374151; margin: 0.3rem 0; font-family: Georgia, serif; }
              .article-body blockquote {
                border-left: 4px solid #f97316; padding: 0.75rem 1.25rem;
                margin: 1.25rem 0; background: #fff7ed; border-radius: 0 0.75rem 0.75rem 0;
                font-style: italic; color: #92400e; font-size: 1.1rem; font-family: Georgia, serif;
              }
              .article-body a { color: #ea580c; text-decoration: underline; font-weight: 600; }
              .article-body a:hover { color: #c2410c; }
            `}</style>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-700 rounded-full text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest transition-colors cursor-default"
              >
                <Tag size={10} />
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Bouton Like */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md disabled:opacity-50 ${
              liked
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-400 hover:text-red-500"
            }`}
          >
            {likeLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
            )}
            {liked ? "Aimé" : "J'aime"} · {likesCount}
          </button>
        </div>
      </article>

      {/* Lien vers le site source */}
      {post.sourceUrl && (
        <div className="container mx-auto max-w-3xl px-4 md:px-6 pb-8">
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-5 py-4 bg-orange-50 border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-100 rounded-2xl transition-all"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-orange-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-0.5">
                Source originale
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-700 transition-colors">
                {post.sourceUrl}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-orange-400 flex-shrink-0 group-hover:text-orange-600 transition-colors" />
          </a>
        </div>
      )}

      {/* Section commentaires */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            Commentaires ({commentsTotal})
          </h2>

          {/* Formulaire d'ajout */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Partagez votre avis sur cet article..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm text-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  {submittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Publier
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl text-sm text-orange-700 text-center">
              <a href="/module/auth/views/login" className="font-bold underline">
                Connectez-vous
              </a>{" "}
              pour laisser un commentaire.
            </div>
          )}

          {/* Liste des commentaires */}
          {commentsLoading && commentsPage === 1 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              Aucun commentaire pour l'instant. Soyez le premier !
            </p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 divide-y divide-gray-100">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  isSuperAdmin={isSuperAdmin}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}

          {/* Charger plus */}
          {commentsPage < commentsTotalPages && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchComments(id, commentsPage + 1)}
                disabled={commentsLoading}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:border-orange-400 hover:text-orange-600 transition-all disabled:opacity-50"
              >
                {commentsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Charger plus de commentaires
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer partage */}
      <ShareBar title={post.title} />
    </main>
  );
}
