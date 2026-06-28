"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Loader2,
  X,
  Tag,
  Link2,
} from "lucide-react";
import { CreatePostDTO } from "../../post/application/dtos/create-post.dto";
import { Category } from "../../categories/domain/entities/category.entity";
import { CategoryRepository } from "../../categories/infrastructure/category.repository";
import { FindAllCategoryUseCase } from "../../categories/application/usecases/findAll-category";
import { TagRepository } from "../../post/infrastructure/tag.repository";
import SelectDropdown from "./SelectDropdown";
import { SetPostTagsUseCase } from "../../post/application/usecases/set-post-tags.usecase";
import { Post } from "../../post/domain/entities/post";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import RichTextEditor from "./RichTextEditor";

enum MediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

const catRepository = new CategoryRepository();
const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepository);
const tagRepository = new TagRepository();
const setPostTagsUseCase = new SetPostTagsUseCase(tagRepository);

interface CreatePostFormProps {
  onSubmitService: (data: CreatePostDTO, file: File | null) => Promise<Post>;
}

export default function CreatePostForm({ onSubmitService }: CreatePostFormProps) {
  const { user } = useAuth();
  const adminId = user?.id;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostDTO>({
    defaultValues: {
      title: "",
      content: "",
      isPublished: true,
      mediaType: MediaType.TEXT,
      categoryId: "",
      adminId: adminId,
      sourceUrl: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Tags chip state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const watchMediaType = watch("mediaType");

  useEffect(() => {
    setLoadingCategories(true);
    findAllCategoryUseCase
      .execute()
      .then(setCategories)
      .catch(() => toast.error("Impossible de charger les catégories"))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum: 15 MB`);
        e.target.value = "";
        return;
      }
      if (watchMediaType === MediaType.IMAGE && !file.type.startsWith("image/")) {
        toast.error("Le fichier doit être une image");
        e.target.value = "";
        return;
      }
      if (watchMediaType === MediaType.VIDEO && !file.type.startsWith("video/")) {
        toast.error("Le fichier doit être une vidéo");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      if (watchMediaType === MediaType.IMAGE) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // ── Tag chip helpers ────────────────────────────────────────────────────────
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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onFormSubmit = async (data: CreatePostDTO) => {
    if (watchMediaType !== MediaType.TEXT && !selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    try {
      const post = await onSubmitService(data, selectedFile);

      // Apply tags if any were entered
      if (tags.length > 0) {
        try {
          await setPostTagsUseCase.execute(post.id, tags);
        } catch {
          toast.error("Post créé mais erreur lors de l'ajout des tags.");
        }
      }

      toast.success("Post créé avec succès !");
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setTags([]);
      setTagInput("");
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;
        let errorMessage = errorData?.message || errorData?.error || "Une erreur est survenue";

        if (Array.isArray(errorMessage)) {
          errorMessage.forEach((msg: string) => toast.error(msg));
          return;
        }

        switch (statusCode) {
          case 400:
            toast.error(`Données invalides : ${errorMessage}`, { duration: 5000 });
            break;
          case 413:
            toast.error("Fichier trop volumineux (max 15 MB)", { duration: 5000 });
            break;
          case 415:
            toast.error(`Type de fichier non supporté : ${errorMessage}`, { duration: 5000 });
            break;
          case 401:
            toast.error("Non autorisé. Veuillez vous reconnecter.");
            break;
          case 403:
            toast.error("Accès refusé.");
            break;
          case 500:
            toast.error("Erreur serveur. Réessayez plus tard.", { duration: 5000 });
            break;
          default:
            toast.error(`Erreur ${statusCode} : ${errorMessage}`, { duration: 5000 });
        }
      } else if (error.request) {
        toast.error("Pas de réponse du serveur. Vérifiez votre connexion.");
      } else {
        toast.error(error.message || "Une erreur inattendue est survenue.");
      }
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
            Créer un nouveau post
          </h2>
          <p className="text-orange-50 mt-1 sm:mt-2 text-xs sm:text-sm">
            Partagez votre contenu avec votre audience
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Titre du post <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", {
                required: "Le titre est obligatoire",
                minLength: { value: 3, message: "3 caractères minimum" },
              })}
              className={`w-full px-3 sm:px-4 text-black py-2 sm:py-3 border-2 rounded-xl transition-all outline-none text-sm sm:text-base ${
                errors.title
                  ? "border-red-500 bg-red-50 focus:border-red-600"
                  : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              }`}
              placeholder="Donnez un titre accrocheur..."
            />
            {errors.title && (
              <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                <span className="text-lg">⚠</span> {errors.title.message}
              </p>
            )}
          </div>

          {/* Type de média */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Type de contenu</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: MediaType.TEXT, label: "Texte", icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { value: MediaType.IMAGE, label: "Image", icon: <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { value: MediaType.VIDEO, label: "Vidéo", icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" /> },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    watchMediaType === type.value
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <input type="radio" {...register("mediaType")} value={type.value} className="sr-only" />
                  <div className={watchMediaType === type.value ? "text-orange-600" : "text-gray-600"}>
                    {type.icon}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      watchMediaType === type.value ? "text-orange-700" : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload */}
          {watchMediaType !== MediaType.TEXT && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Fichier {watchMediaType === MediaType.IMAGE ? "image" : "vidéo"}
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">(Max: 15 MB)</span>
              </label>
              <div className="relative border-2 border-dashed border-orange-300 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-pink-50 hover:border-orange-400 transition-all">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={watchMediaType === MediaType.IMAGE ? "image/*" : "video/*"}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-orange-500 mb-2 sm:mb-3" />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-medium text-green-700">✓ Fichier sélectionné</p>
                      <p className="text-xs text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full inline-block break-all max-w-full">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Cliquez pour sélectionner</p>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">ou glissez-déposez ici</p>
                    </div>
                  )}
                </div>
              </div>
              {previewUrl && watchMediaType === MediaType.IMAGE && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Aperçu :</p>
                  <img src={previewUrl} alt="Preview" className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg" />
                </div>
              )}
            </div>
          )}

          {/* Contenu */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Contenu du post</label>
            <RichTextEditor
              value={watch("content") ?? ""}
              onChange={(html) => setValue("content", html, { shouldDirty: true })}
              placeholder="Écrivez votre contenu ici…"
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="hidden"
              {...register("categoryId", { required: "Veuillez sélectionner une catégorie" })}
            />
            <SelectDropdown
              options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
              value={watch("categoryId") ?? ""}
              onChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
              placeholder={loadingCategories ? "Chargement..." : "Sélectionnez une catégorie"}
              disabled={loadingCategories}
              error={!!errors.categoryId}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                <span className="text-lg">⚠</span> {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Site source */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-orange-600" />
              Site web source
              <span className="text-xs font-normal text-gray-400">(optionnel)</span>
            </label>
            <input
              {...register("sourceUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "L'URL doit commencer par http:// ou https://",
                },
              })}
              type="url"
              className={`w-full px-3 sm:px-4 text-black py-2 sm:py-3 border-2 rounded-xl transition-all outline-none text-sm sm:text-base ${
                errors.sourceUrl
                  ? "border-red-500 bg-red-50 focus:border-red-600"
                  : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              }`}
              placeholder="https://exemple.com/article-original"
            />
            {errors.sourceUrl && (
              <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                <span className="text-lg">⚠</span> {errors.sourceUrl.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              Tags
              <span className="text-xs font-normal text-gray-400">(optionnel, max 10)</span>
            </label>
            <div
              onClick={() => tagInputRef.current?.focus()}
              className="min-h-[44px] flex flex-wrap gap-2 items-center px-3 py-2 border-2 border-gray-200 rounded-xl cursor-text focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all"
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
                    <X size={12} />
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
                  placeholder={tags.length === 0 ? "cuisine, recette, ... (Entrée pour valider)" : ""}
                  className="flex-1 min-w-[140px] outline-none text-sm text-black bg-transparent placeholder:text-gray-400"
                />
              )}
            </div>
            <p className="text-xs text-gray-400">Appuyez sur Entrée ou virgule pour ajouter un tag.</p>
          </div>

          <input type="hidden" {...register("adminId")} />

          {/* Publication immédiate */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <input
              type="checkbox"
              {...register("isPublished")}
              id="isPublished"
              className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
            <label
              htmlFor="isPublished"
              className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Publier immédiatement ce post
            </label>
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-white text-base sm:text-lg transition-all transform ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Création en cours...
              </span>
            ) : (
              "Créer le post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
