"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import { Category } from "../../categories/domain/entities/category.entity";
import { CategoryRepository } from "../../categories/infrastructure/category.repository";
import { FindAllCategoryUseCase } from "../../categories/application/usecases/findAll-category";
import { CreateCategoryUseCase } from "../../categories/application/usecases/create-categoryusecase";
import { CreateCategoryDto } from "../../categories/application/dtos/create-dto";
import { UpdateCategoryUseCase } from "../../categories/application/usecases/update-category.usecase";
import { DeleteCategoryUseCase } from "../../categories/application/usecases/delete-category.usecase";

const cateRepo = new CategoryRepository();
const findAllCategoryUseCase = new FindAllCategoryUseCase(cateRepo);
const createCategoryUseCase = new CreateCategoryUseCase(cateRepo);
const updateCategoryUseCase = new UpdateCategoryUseCase(cateRepo);
const deleteCategoryUseCase = new DeleteCategoryUseCase(cateRepo);

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const cats = await findAllCategoryUseCase.execute();
      setCategories(cats);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      await createCategoryUseCase.execute(formData);
      await fetchCategories();
    } else {
      if (!selectedCategory) return;
      await updateCategoryUseCase.execute(selectedCategory.id, formData);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: formData.name } : cat,
        ),
      );
    }
    closeModal();
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategoryUseCase.execute(categoryToDelete.id);
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="lg:ml-64 pb-20 lg:pb-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
                Gestion des Catégories
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {categories.length} catégorie{categories.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-orange-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Nouvelle Catégorie
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 sm:mt-6 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 text-black py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-sm sm:text-base"
            />
          </div>
        </div>
        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <FolderOpen className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "Aucun résultat" : "Aucune catégorie"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              {searchQuery
                ? "Essayez avec d'autres mots-clés"
                : "Commencez par créer votre première catégorie"}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="bg-orange-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Créer une catégorie
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="bg-orange-500 h-2"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 break-words">
                      {category.name}
                    </h2>
                    <div className="flex gap-1 sm:gap-2 ml-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">{category.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {modalMode === "create" ? (
                    <><Plus className="w-5 h-5 sm:w-6 sm:h-6" /> Nouvelle Catégorie</>
                  ) : (
                    <><Edit className="w-5 h-5 sm:w-6 sm:h-6" /> Modifier la Catégorie</>
                  )}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 p-1 sm:p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nom de la catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 text-black focus:ring-orange-100 outline-none transition-all text-sm sm:text-base"
                    placeholder="Ex: Restauration rapide, Fast-food..."
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {modalMode === "create" ? "Créer" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  Confirmer la suppression
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-white hover:bg-white/20 p-1 sm:p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                  <p className="text-sm sm:text-base text-gray-700">
                    Êtes-vous sûr de vouloir supprimer la catégorie{" "}
                    <span className="font-bold text-red-700">"{categoryToDelete.name}"</span> ?
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    Cette action est irréversible.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
