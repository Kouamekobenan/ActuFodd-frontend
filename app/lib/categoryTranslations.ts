const translations: Record<string, Record<string, string>> = {
  fr: {
    Tendance: "Tendance",
    Restaurants: "Restaurants",
    Recette: "Recette",
    "Portrait & Rencontre": "Portrait & Rencontre",
    Agenda: "Agenda",
  },
  en: {
    Tendance: "Trend",
    Restaurants: "Restaurants",
    Recette: "Recipe",
    "Portrait & Rencontre": "Portrait & Encounter",
    Agenda: "Agenda",
  },
};

export function translateCategory(name: string, locale: string): string {
  const trimmed = name.trim();
  return translations[locale]?.[trimmed] ?? trimmed;
}
