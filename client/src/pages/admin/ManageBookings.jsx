import { useState } from "react";
import Sidebar      from "../../components/common/Sidebar";
import Navbar       from "../../components/common/Navbar";
import BookingTable from "../../components/admin/BookingTable";
import { useBookings } from "../../hooks/useBookings";
import { COLORS } from "../../utils/constants";

const C = COLORS;

const FILTERS = ["all", "confirmed", "pending", "cancelled", "completed"];

export default function ManageBookings() {
  const { bookings, loading, message, cancelBooking } = useBookings(true);
  const [filter,  setFilter]  = useState("all");
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking? The next student in the waiting list will be auto-assigned.")) return;
    setCancelling(id);
    await cancelBooking(id);
    setCancelling(null);
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? bookings.length : bookings.filter((b) => b.status === f).length;
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title="Manage Bookings" subtitle={`${bookings.length} total bookings`} />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "8px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s", background: filter === f ? C.accent : "transparent", color: filter === f ? "#fff" : C.muted, border: `1px solid ${filter === f ? C.accent : C.border}` }}>
                {f} ({counts[f] ?? 0})
              </button>
            ))}
          </div>

          {message && (
            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: C.success, fontSize: 14 }}>
              ✅ {message}
            </div>
          )}

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {loading
              ? <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading bookings...</div>
              : <BookingTable bookings={filtered} onCancel={handleCancel} showStudent={true} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}