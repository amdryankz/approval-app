export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

