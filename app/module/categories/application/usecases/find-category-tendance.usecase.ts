// Route /categories/tendance supprimée dans la nouvelle API.
// Utiliser /posts/trending à la place (voir CategoryTendance.tsx).
export class FindCategoryTendanceUsecase {
  async execute(): Promise<never[]> {
    return [];
  }
}
