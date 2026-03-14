import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import { COLORS } from "../../utils/constants";
import NotificationBell from "./NotificationBell";

const C = COLORS;

export default function Navbar({ title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <header style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <NotificationBell />

        {/* User pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "7px 14px", cursor: "pointer",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "capitalize" }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}