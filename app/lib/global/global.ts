export const formatDate = (dateString?: string) => {
  if (!dateString) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};
