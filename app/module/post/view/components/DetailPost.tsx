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
            <span className="flex items-center gap-1">
              <Eye size={13} /> {post.views}
            </span>
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
            <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-gray-400" />
              {post.views} vue{post.views > 1 ? "s" : ""}
            </span>
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
            <p
              className="text-lg md:text-2xl font-serif leading-relaxed text-gray-800
              first-letter:text-5xl md:first-letter:text-7xl
              first-letter:font-black first-letter:text-orange-600
              first-letter:mr-2 md:first-letter:mr-3
              first-letter:float-left first-letter:leading-none"
            >
              {post.content}
            </p>
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
      <section className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 md:mb-8 text-gray-400">
            Partagez cet article
          </h3>
          <div className="flex justify-center gap-6 md:gap-8">
            {["Twitter", "Facebook", "WhatsApp"].map((social) => (
              <button
                key={social}
                className="text-gray-500 hover:text-orange-600 transition-colors uppercase text-[9px] md:text-[10px] font-bold tracking-widest"
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
