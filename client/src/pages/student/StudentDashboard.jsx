import { useEffect, useState } from "react";
import Sidebar  from "../../components/common/Sidebar";
import Navbar   from "../../components/common/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useBookings";
import { useHostels }  from "../../hooks/useHostels";
import { COLORS } from "../../utils/constants";
import { formatDate, formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function StudentDashboard() {
  const { user }                      = useAuth();
  const { bookings, loading: bLoad }  = useBookings(true);
  const { hostels,  loading: hLoad }  = useHostels(true);

  const active   = bookings.find((b) => b.status === "confirmed");
  const loading  = bLoad || hLoad;

  const stats = [
    { label: "Total Bookings",    value: bookings.length,                                       icon: "📋", color: C.accent   },
    { label: "Active Booking",    value: bookings.filter((b) => b.status === "confirmed").length, icon: "✅", color: C.success  },
    { label: "Hostels Available", value: hostels.filter((h) => h.availableRooms > 0).length,    icon: "🏨", color: C.warning  },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar
          title={`Good day, ${user?.name?.split(" ")[0]} 👋`}
          subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {/* Active booking hero */}
          {!loading && (
            active ? (
              <div style={{ background: "linear-gradient(135deg,#1e3a6e,#1a2d5a)", border: `1px solid ${C.accent}30`, borderRadius: 20, padding: "26px 30px", marginBottom: 26, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: `${C.accent}10` }} />
                <div style={{ fontSize: 12, color: `${C.accent}cc`, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Current Accommodation</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{active.hostelId?.name}</div>
                <div style={{ fontSize: 14, color: `${C.text}99`, marginBottom: 20 }}>{active.hostelId?.location?.address}, {active.hostelId?.location?.city}</div>
                <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
                  {[
                    { label: "Check-in",  value: formatDate(active.checkInDate) },
                    { label: "Check-out", value: formatDate(active.checkOutDate) },
                    { label: "Monthly",   value: formatCurrency(active.hostelId?.pricePerMonth) },
                    { label: "Status",    value: "✅ Active" },
                  ].map((d) => (
                    <div key={d.label}>
                      <div style={{ fontSize: 11, color: `${C.text}55`, marginBottom: 3 }}>{d.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px", marginBottom: 26, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No active booking</div>
                <div style={{ fontSize: 14, color: C.muted, marginBottom: 18 }}>Find and book a hostel near your college</div>
                <a href="/dashboard/hostels" style={{ display: "inline-block", padding: "10px 26px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 12, color: "#fff", fontWeight: 700, textDecoration: "none" }}>
                  🔍 Find Hostels
                </a>
              </div>
            )
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 26 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, margin: "6px 0 2px" }}>{loading ? "—" : s.value}</div>
                <div style={{ fontSize: 22, opacity: 0.15 }}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Bookings</div>
              <a href="/dashboard/bookings" style={{ fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600 }}>View all →</a>
            </div>
            {loading ? <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading...</div>
              : bookings.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No bookings yet.</div>
              : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Hostel", "Check-In", "Check-Out", "Status"].map((h) => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => {
                      const st = { confirmed: { bg: "#10b98115", color: "#10b981" }, pending: { bg: "#f59e0b15", color: "#f59e0b" }, cancelled: { bg: "#ef444415", color: "#ef4444" }, completed: { bg: "#3b82f615", color: "#3b82f6" } }[b.status] || {};
                      return (
                        <tr key={b._id}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 600, color: C.text }}>{b.hostelId?.name || "—"}</td>
                          <td style={{ padding: "13px 20px", fontSize: 13, color: C.muted }}>{formatDate(b.checkInDate)}</td>
                          <td style={{ padding: "13px 20px", fontSize: 13, color: C.muted }}>{formatDate(b.checkOutDate)}</td>
                          <td style={{ padding: "13px 20px" }}><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, textTransform: "capitalize" }}>{b.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}