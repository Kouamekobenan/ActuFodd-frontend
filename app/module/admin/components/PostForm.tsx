"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Loader2,
} from "lucide-react";
import { CreatePostDTO } from "../../post/application/dtos/create-post.dto";
import { Category } from "../../categories/domain/entities/category.entity";
import { CategoryRepository } from "../../categories/infrastructure/category.repository";
import { FindAllCategoryUseCase } from "../../categories/application/usecases/findAll-category";

// Mock types and enums for demonstration
enum MediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}


const catRepository = new CategoryRepository();
const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepository);


interface CreatePostFormProps {
  onSubmitService: (data: CreatePostDTO, file: File | null) => Promise<void>;
}

export default function CreatePostForm({
  onSubmitService,
}: CreatePostFormProps) {
  const adminId = "demo-admin-id";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostDTO>({
    defaultValues: {
      title: "",
      content: "",
      isPublished: true,
      mediaType: MediaType.TEXT,
      categoryId: "",
      adminId: adminId,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const watchMediaType = watch("mediaType");

   const fetchCategories = async () => {
     setLoadingCategories(true);
     try {
       const result = await findAllCategoryUseCase.execute();
       setCategories(result);
     } catch (error) {
       console.error("Erreur lors de la récupération des catégories:", error);
     } finally {
       setLoadingCategories(false);
     }
   };

    useEffect(() => {
      fetchCategories();
    }, []);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (watchMediaType === MediaType.IMAGE) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const onFormSubmit = async (data: CreatePostDTO) => {
    try {
      await onSubmitService(data, selectedFile);
      alert("Post créé avec succès !");
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du post.");
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
            <label className="block text-sm font-semibold text-gray-700">
              Type de contenu
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  value: MediaType.TEXT,
                  label: "Texte",
                  icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
                },
                {
                  value: MediaType.IMAGE,
                  label: "Image",
                  icon: <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />,
                },
                {
                  value: MediaType.VIDEO,
                  label: "Vidéo",
                  icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" />,
                },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    watchMediaType === type.value
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("mediaType")}
                    value={type.value}
                    className="sr-only"
                  />
                  <div
                    className={`${watchMediaType === type.value ? "text-orange-600" : "text-gray-600"}`}
                  >
                    {type.icon}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      watchMediaType === type.value
                        ? "text-orange-700"
                        : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* Upload de fichier */}
          {watchMediaType !== MediaType.TEXT && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Fichier {watchMediaType === MediaType.IMAGE ? "image" : "vidéo"}
              </label>
              <div className="relative border-2 border-dashed border-orange-300 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-pink-50 hover:border-orange-400 transition-all">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    watchMediaType === MediaType.IMAGE ? "image/*" : "video/*"
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-orange-500 mb-2 sm:mb-3" />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-medium text-green-700">
                        ✓ Fichier sélectionné
                      </p>
                      <p className="text-xs text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full inline-block break-all max-w-full">
                        {selectedFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        Cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        ou glissez-déposez ici
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Aperçu de l'image */}
              {previewUrl && watchMediaType === MediaType.IMAGE && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Aperçu :
                  </p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Contenu */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Contenu du post
            </label>
            <textarea
              {...register("content")}
              rows={5}
              className="w-full text-black px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl transition-all outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none text-sm sm:text-base"
              placeholder="Écrivez votre contenu ici..."
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId", {
                required: "Veuillez sélectionner une catégorie",
              })}
              disabled={loadingCategories}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 text-black rounded-xl transition-all outline-none appearance-none cursor-pointer text-sm sm:text-base ${
                errors.categoryId
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              }`}
            >
              <option value="">
                {loadingCategories
                  ? "Chargement..."
                  : "Sélectionnez une catégorie"}
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat._name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                <span className="text-lg">⚠</span> {errors.categoryId.message}
              </p>
            )}
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

          {/* Bouton de soumission */}
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
