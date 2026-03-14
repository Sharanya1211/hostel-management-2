export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ROLES = {
  ADMIN:   "admin",
  STUDENT: "student",
};

export const BOOKING_STATUS = {
  PENDING:   "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const PAYMENT_STATUS = {
  UNPAID:   "unpaid",
  PAID:     "paid",
  REFUNDED: "refunded",
};

export const HOSTEL_TYPES = ["boys", "girls", "mixed"];

export const STATUS_STYLES = {
  confirmed: { bg: "#10b98115", color: "#10b981", label: "Confirmed" },
  pending:   { bg: "#f59e0b15", color: "#f59e0b", label: "Pending"   },
  cancelled: { bg: "#ef444415", color: "#ef4444", label: "Cancelled" },
  completed: { bg: "#3b82f615", color: "#3b82f6", label: "Completed" },
};

export const COLORS = {
  bg:      "#0a0f1e",
  surface: "#0d1525",
  card:    "#0e1830",
  border:  "#1e2d45",
  accent:  "#3b82f6",
  text:    "#f1f5f9",
  muted:   "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger:  "#ef4444",
};