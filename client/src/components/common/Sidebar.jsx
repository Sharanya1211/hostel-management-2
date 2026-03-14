import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import { COLORS } from "../../utils/constants";

const C = COLORS;

const ADMIN_NAV = [
  { icon: "📊", label: "Dashboard",    path: "/admin"                },
  { icon: "🏨", label: "Hostels",      path: "/admin/hostels"        },
  { icon: "📋", label: "Bookings",     path: "/admin/bookings"       },
  { icon: "⏳", label: "Waiting List", path: "/admin/waiting-list"   },
];

const STUDENT_NAV = [
  { icon: "🏠", label: "Dashboard",    path: "/dashboard"            },
  { icon: "🔍", label: "Find Hostels", path: "/dashboard/hostels"    },
  { icon: "📋", label: "My Bookings",  path: "/dashboard/bookings"   },
  { icon: "⏳", label: "Waiting List", path: "/dashboard/waiting"    },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const nav = user?.role === "admin" ? ADMIN_NAV : STUDENT_NAV;

  return (
    <aside style={{
      width: 240,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      height: "100vh",
      top: 0, left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          🏨
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>HostelPro</div>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "capitalize" }}>{user?.role} Portal</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {nav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", margin: "2px 0",
                borderRadius: 10, cursor: "pointer",
                fontSize: 14, fontWeight: 500,
                background: active ? `${C.accent}18` : "transparent",
                color:      active ? C.accent        : C.muted,
                borderLeft: `3px solid ${active ? C.accent : "transparent"}`,
                paddingLeft: active ? 11 : 14,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#131f35";
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ width: "100%", padding: "8px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef444460"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.color = C.muted;  }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}