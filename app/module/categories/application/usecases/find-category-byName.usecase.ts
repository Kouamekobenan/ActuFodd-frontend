// Route /categories/tendance/by-name supprimée dans la nouvelle API.
// Utiliser directement l'API posts + filtrage côté client (voir FindByNameCat.tsx).
export class FindCategoryByName {
  async execute(_catName: string): Promise<never[]> {
    return [];
  }
}
