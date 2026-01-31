"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  X,
  Trash2,
  Search,
  Users2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { RegisterDto } from "../../application/dtos/create-user.dto";
import { UserRepository } from "../../infrastructure/user-repository";
import { RegisterUserUseCase } from "../../application/usecases/create-use.usecase";
import { User as Users } from "../../domain/user.entity";
import { api } from "../../../../common/database/api";
import { formatDate } from "../../../../lib/global/global";

const userRepo = new UserRepository();
const createUserUseCase = new RegisterUserUseCase(userRepo);

export default function AdminManagement() {
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // États pour la suppression
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);

  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterDto, string>>
  >({});

  // --- LOGIQUE DE SUPPRESSION ---
  const openDeleteConfirm = (user: Users) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete.id);
    try {
      await api.delete(`/users/${userToDelete.id}`);
      // Mise à jour locale : filtrer l'utilisateur supprimé
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success(`${userToDelete.name} supprimé avec succès`);
      closeDeleteConfirm();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression",
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  // --- LOGIQUE DE CRÉATION & VALIDATION ---
  const validateField = (name: keyof RegisterDto, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.trim().length < 3) error = "Min. 3 caractères";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Email invalide";
        break;
      case "password":
        if (value.length < 6) error = "Min. 6 caractères";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const fetchDataUser = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await api.get("users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Erreur de chargement des administrateurs");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name as keyof RegisterDto, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isNameValid = validateField("name", formData.name);
    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      toast.error("Veuillez corriger les erreurs.");
      setLoading(false);
      return;
    }

    try {
      await createUserUseCase.execute(formData);
      toast.success("Administrateur créé avec succès !");
      handleCloseModal();
      fetchDataUser();
    } catch (error: any) {
      toast.error(error.message || "Erreur de création");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ email: "", password: "", name: "" });
    setErrors({});
    setShowPassword(false);
  };

  const inputClass = (name: keyof RegisterDto) => `
    w-full pl-11 pr-4 text-gray-800 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 
    transition-all duration-300 ${errors[name] ? "border-red-500 bg-red-50" : "border-gray-300"}
  `;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users2 className="w-6 h-6 text-orange-600" />
                Gestion Admins
              </h1>
              <p className="text-sm text-gray-500">
                {users.length} administrateurs enregistrés
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full lg:w-auto bg-orange-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-md active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              <span className="whitespace-nowrap">Nouvel Admin</span>
            </button>
          </div>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-2" />
              <p>Chargement des données...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Aucun administrateur trouvé.
            </div>
          ) : (
            <>
              {/* VUE TABLEAU (Desktop) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Création
                      </th>
                      <th className="px-6 py-4 font-bold text-center tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-orange-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {user.createdAt ? formatDate(user.createdAt) : "--"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openDeleteConfirm(user)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* VUE LISTE (Mobile) */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between bg-white"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-bold text-gray-900 truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                      <span className="text-[10px] text-gray-400 italic">
                        Le {user.createdAt ? formatDate(user.createdAt) : "--"}
                      </span>
                    </div>
                    <button
                      onClick={() => openDeleteConfirm(user)}
                      className="ml-4 p-3 text-red-600 bg-red-50 rounded-xl active:scale-90 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL : CRÉATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" />
                Nouvel Admin
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Ex: Jude Kouakou"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass("name")}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Email professionnel
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1 pb-4">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass("password")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] ml-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Confirmer la création"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : CONFIRMATION SUPPRESSION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Supprimer l'admin ?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Voulez-vous vraiment retirer{" "}
                <span className="font-bold text-gray-800">
                  {userToDelete?.name}
                </span>{" "}
                ? Cette action est irréversible.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!!deletingUserId}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  {deletingUserId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Supprimer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
