// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// Format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

// Calculate days between two dates
export const daysBetween = (date1, date2 = new Date()) => {
  return Math.floor((new Date(date2) - new Date(date1)) / 86400000);
};

// Calculate occupancy percentage
export const occupancyRate = (total, available) => {
  if (!total) return 0;
  return (((total - available) / total) * 100).toFixed(1);
};

// Haversine distance formula (km)
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

// Get initials from name
export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// Truncate long text
export const truncate = (str, n = 40) =>
  str?.length > n ? str.slice(0, n) + "..." : str || "—";