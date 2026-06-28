"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, X, Upload, FileText, Image as ImageIcon, Video, Save, Tag, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { PostRepository } from "../../post/infrastructure/post.repository";
import { FindAllPostUseCase } from "../../post/application/usecases/findAll-post.usecase";
import { DeletePostUseCase } from "../../post/application/usecases/delete-post.usecase";
import { UpdatePostUseCase } from "../../post/application/usecases/update-post.usecase";
import { Post } from "../../post/domain/entities/post";
import { MediaType } from "../../post/domain/enums/media-type";
import { UpdatePostDTO } from "../../post/application/dtos/update-post.dto";
import { CategoryRepository } from "../../categories/infrastructure/category.repository";
import { FindAllCategoryUseCase } from "../../categories/application/usecases/findAll-category";
import { Category } from "../../categories/domain/entities/category.entity";
import { TagRepository } from "../../post/infrastructure/tag.repository";
import { SetPostTagsUseCase } from "../../post/application/usecases/set-post-tags.usecase";
import { formatDate } from "../../../lib/global/global";
import RichTextEditor from "./RichTextEditor";
import SelectDropdown from "./SelectDropdown";

const postRepo = new PostRepository();
const catRepo = new CategoryRepository();
const tagRepo = new TagRepository();
const findAllPostUseCase = new FindAllPostUseCase(postRepo);
const deletePostUseCase = new DeletePostUseCase(postRepo);
const updatePostUseCase = new UpdatePostUseCase(postRepo);
const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepo);
const setPostTagsUseCase = new SetPostTagsUseCase(tagRepo);

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  post: Post;
  categories: Category[];
  onClose: () => void;
  onSaved: (updated: Post) => void;
}

function EditModal({ post, categories, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState<UpdatePostDTO>({
    title: post.title,
    content: post.content ?? "",
    mediaType: post.mediaType,
    categoryId: post.categoryId ?? "",
    isPublished: post.isPublished,
    sourceUrl: post.sourceUrl ?? "",
  });
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(post.mediaUrl ?? null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tags
  const [tags, setTags] = useState<string[]>(post.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const name = raw.trim().toLowerCase();
    if (name && !tags.includes(name) && tags.length < 10) {
      setTags((prev) => [...prev, name]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 100 MB)");
      return;
    }
    setNewFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePostUseCase.execute(post.id, form, newFile ?? undefined);

      // Sync tags (full replace) if they changed
      const originalTags = post.tags ?? [];
      const tagsChanged =
        tags.length !== originalTags.length || tags.some((t) => !originalTags.includes(t));
      if (tagsChanged) {
        try {
          const newTags = await setPostTagsUseCase.execute(post.id, tags);
          updated.tags = newTags;
        } catch {
          toast.error("Post mis à jour mais erreur lors de la mise à jour des tags.");
        }
      } else {
        updated.tags = tags;
      }

      toast.success("Post mis à jour !");
      onSaved(updated);
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Modifier le post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              minLength={3}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-black focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-sm"
              placeholder="Titre du post"
            />
          </div>

          {/* Type de média */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de contenu</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: MediaType.TEXT, label: "Texte", icon: <FileText className="w-4 h-4" /> },
                { value: MediaType.IMAGE, label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
                { value: MediaType.VIDEO, label: "Vidéo", icon: <Video className="w-4 h-4" /> },
              ].map((t) => (
                <label
                  key={t.value}
                  className={`flex flex-col items-center gap-1 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    form.mediaType === t.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={form.mediaType === t.value}
                    onChange={() => setForm({ ...form, mediaType: t.value })}
                  />
                  <span className={form.mediaType === t.value ? "text-orange-600" : "text-gray-500"}>
                    {t.icon}
                  </span>
                  <span className="text-xs font-medium text-gray-700">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload fichier */}
          {form.mediaType !== MediaType.TEXT && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {form.mediaType === MediaType.IMAGE ? "Image" : "Vidéo"}{" "}
                <span className="text-gray-400 font-normal">(laisser vide pour conserver l'actuel)</span>
              </label>
              <div
                className="relative border-2 border-dashed border-orange-300 rounded-xl p-4 bg-orange-50 hover:border-orange-400 transition-all cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept={form.mediaType === MediaType.IMAGE ? "image/*" : "video/*"}
                  onChange={handleFile}
                />
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-orange-400 mb-1" />
                  {newFile ? (
                    <p className="text-sm text-green-700 font-medium">{newFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Cliquer pour changer le fichier</p>
                  )}
                </div>
              </div>
              {previewUrl && form.mediaType === MediaType.IMAGE && (
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="mt-3 w-full h-40 object-cover rounded-xl"
                />
              )}
            </div>
          )}

          {/* Contenu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contenu</label>
            <RichTextEditor
              value={form.content ?? ""}
              onChange={(html) => setForm({ ...form, content: html })}
              placeholder="Contenu du post…"
              minHeight="180px"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
            <SelectDropdown
              options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
              value={form.categoryId ?? ""}
              onChange={(val) => setForm({ ...form, categoryId: val })}
              placeholder="— Aucune catégorie —"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              Tags
              <span className="text-xs font-normal text-gray-400">(max 10)</span>
            </label>
            <div
              onClick={() => tagInputRef.current?.focus()}
              className="min-h-[44px] flex flex-wrap gap-2 items-center px-3 py-2 border-2 border-gray-200 rounded-xl cursor-text focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all mt-1"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="hover:text-orange-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              {tags.length < 10 && (
                <input
                  ref={tagInputRef}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                  placeholder={tags.length === 0 ? "Entrée ou virgule pour valider" : ""}
                  className="flex-1 min-w-[120px] outline-none text-sm text-black bg-transparent placeholder:text-gray-400"
                />
              )}
            </div>
          </div>

          {/* Site source */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-orange-600" />
              Site web source
              <span className="text-xs font-normal text-gray-400">(optionnel)</span>
            </label>
            <input
              type="url"
              value={form.sourceUrl ?? ""}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-black focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-sm"
              placeholder="https://exemple.com/article-original"
            />
          </div>

          {/* Publié */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">
              Publier ce post
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PostAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const PAGE_LIMIT = 6;

  const fetchPostData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findAllPostUseCase.execute(PAGE_LIMIT, page);
      setPosts(response.data);
      setTotalPages(response.totalPages || 1);
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

  useEffect(() => {
    findAllCategoryUseCase.execute().then(setCategories).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePostUseCase.execute(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      toast.success("Post supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSaved = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // ── Shared button styles ──
  const editBtn =
    "flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all flex-shrink-0";
  const deleteBtn =
    "flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all flex-shrink-0";

  const EditIcon = () => (
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
  const TrashIcon = () => (
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-4 sm:py-8 px-3 sm:px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                  Gestion des Publications
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {posts.length} articles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                      view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {v === "grid" ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <Link
                href="/module/admin/posts/new"
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau Post
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-3 sm:space-y-4"}>
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div key={i} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 ${view === "grid" ? "h-80 sm:h-96" : "h-28 sm:h-32"}`}>
                <div className="animate-pulse bg-gray-200 w-full h-full" />
              </div>
            ))}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
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
                  {!post.isPublished && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Brouillon
                    </span>
                  )}
                </div>

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

                  <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100 flex-shrink-0">
                    <Link
                      href={`/module/post/view/page/${post.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all min-w-0"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="truncate">Voir</span>
                    </Link>
                    <button onClick={() => setEditPost(post)} className={editBtn} title="Modifier">
                      <EditIcon />
                    </button>
                    <button onClick={() => setDeleteConfirm(post.id)} className={deleteBtn} title="Supprimer">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className="relative w-full sm:w-40 md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-gray-100">
                    <img
                      src={post.mediaUrl || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow flex flex-col min-w-0">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-gray-700 truncate max-w-[120px] sm:max-w-none">
                        {post.category?.name || "Général"}
                      </span>
                      {!post.isPublished && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                          Brouillon
                        </span>
                      )}
                      <span className="text-gray-400 text-xs font-semibold truncate">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 break-words">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 break-words">{post.content}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 sm:pt-4">
                      <Link
                        href={`/module/post/view/page/${post.id}`}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </Link>
                      <button
                        onClick={() => setEditPost(post)}
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <EditIcon /> Modifier
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <TrashIcon /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 px-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm disabled:hover:bg-white disabled:hover:text-gray-400 flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-x-auto max-w-[200px] sm:max-w-none">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                    page === i + 1 ? "bg-orange-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editPost && (
        <EditModal
          post={editPost}
          categories={categories}
          onClose={() => setEditPost(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-xs sm:text-sm text-gray-500">Cette action est irréversible</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Êtes-vous sûr de vouloir supprimer cet article ? Toutes les données associées seront perdues définitivement.
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
