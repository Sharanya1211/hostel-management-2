import { useState } from "react";
import Sidebar      from "../../components/common/Sidebar";
import Navbar       from "../../components/common/Navbar";
import { useBookings } from "../../hooks/useBookings";
import { COLORS } from "../../utils/constants";

const C = COLORS;

const FILTERS = ["all", "confirmed", "pending", "cancelled", "completed"];

const STATUS_STYLE = {
  confirmed: { bg: "#10b98115", color: "#10b981" },
  pending:   { bg: "#f59e0b15", color: "#f59e0b" },
  cancelled: { bg: "#ef444415", color: "#ef4444" },
  completed: { bg: "#3b82f615", color: "#3b82f6" },
};

export default function ManageBookings() {
  const { bookings, loading, message, cancelBooking } = useBookings(true);
  const [filter,     setFilter]     = useState("all");
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking? The next student in the waiting list will be auto-assigned.")) return;
    setCancelling(id);
    await cancelBooking(id);
    setCancelling(null);
  };

  const filtered = filter === "all" ? bookings : bookings.filter(function(b) { return b.status === filter; });

  const counts = FILTERS.reduce(function(acc, f) {
    acc[f] = f === "all" ? bookings.length : bookings.filter(function(b) { return b.status === f; }).length;
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title="Manage Bookings" subtitle={bookings.length + " total bookings"} />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {FILTERS.map(function(f) {
              return (
                <button key={f} onClick={function() { setFilter(f); }}
                  style={{ padding: "8px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize", background: filter === f ? C.accent : "transparent", color: filter === f ? "#fff" : C.muted, border: "1px solid " + (filter === f ? C.accent : C.border) }}>
                  {f} ({counts[f] || 0})
                </button>
              );
            })}
          </div>

          {message && (
            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: C.success, fontSize: 14 }}>
              ✅ {message}
            </div>
          )}

          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: C.muted }}>No bookings found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Student", "Phone", "Hostel", "Check-In", "Check-Out", "Status", "Payment", "Action"].map(function(h) {
                      return (
                        <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid " + C.border }}>
                          {h}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(function(b) {
                    var st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                    return (
                      <tr key={b._id}
                        onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>

                        {/* Student name + email */}
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                            {b.userId ? b.userId.name : "—"}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                            {b.userId ? b.userId.email : ""}
                          </div>
                        </td>

                        {/* Phone number */}
                        <td style={{ padding: "13px 16px" }}>
                          {b.userId && b.userId.phone ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontSize: 12 }}>📞</span>
                              <span style={{ fontSize: 13, color: C.text }}>{b.userId.phone}</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: C.muted }}>—</span>
                          )}
                        </td>

                        {/* Hostel */}
                        <td style={{ padding: "13px 16px", fontSize: 13, color: C.muted }}>
                          {b.hostelId ? b.hostelId.name : "—"}
                        </td>

                        {/* Check-in */}
                        <td style={{ padding: "13px 16px", fontSize: 13, color: C.muted }}>
                          {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : "—"}
                        </td>

                        {/* Check-out */}
                        <td style={{ padding: "13px 16px", fontSize: 13, color: C.muted }}>
                          {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : "—"}
                        </td>

                        {/* Status badge */}
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, textTransform: "capitalize" }}>
                            {b.status}
                          </span>
                        </td>

                        {/* Payment badge */}
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.paymentStatus === "paid" ? "#10b98115" : "#f59e0b15", color: b.paymentStatus === "paid" ? "#10b981" : "#f59e0b", textTransform: "capitalize" }}>
                            {b.paymentStatus}
                          </span>
                        </td>

                        {/* Cancel button */}
                        <td style={{ padding: "13px 16px" }}>
                          {b.status === "confirmed" && (
                            <button
                              onClick={function() { handleCancel(b._id); }}
                              disabled={cancelling === b._id}
                              style={{ padding: "5px 12px", background: "#ef444415", border: "1px solid #ef444440", borderRadius: 8, color: C.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                              {cancelling === b._id ? "..." : "Cancel"}
                            </button>
                          )}
                        </td>

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