import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../utils/constants";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - loading:", loading, "user:", user);

  // Still checking token → show loader, do NOT redirect yet
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily: "sans-serif",
      }}>
        <div style={{ fontSize: 40 }}>🏨</div>
        <div style={{ color: COLORS.accent, fontSize: 15 }}>Loading...</div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    console.log("ProtectedRoute - no user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Wrong role → go to login
  if (roles && !roles.includes(user.role)) {
    console.log("ProtectedRoute - wrong role:", user.role, "required:", roles);
    return <Navigate to="/login" replace />;
  }

  // All good → render page
  return children;
}