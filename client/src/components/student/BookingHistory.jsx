import { COLORS, STATUS_STYLES } from "../../utils/constants";
import { formatDate, formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function BookingHistoryList({ bookings, onCancel, cancelling }) {
  if (!bookings.length) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>No bookings yet</div>
        <div style={{ fontSize: 14, color: C.muted }}>Make your first booking from the Find Hostels page.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {bookings.map((b) => {
        const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
        return (
          <div key={b._id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{b.hostelId?.name || "Hostel"}</div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>
                📍 {b.hostelId?.location?.city || "—"}
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                <span style={{ color: C.muted }}>Check-in: <span style={{ color: C.text }}>{formatDate(b.checkInDate)}</span></span>
                <span style={{ color: C.muted }}>Check-out: <span style={{ color: C.text }}>{formatDate(b.checkOutDate)}</span></span>
              </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>
                {formatCurrency(b.hostelId?.pricePerMonth)}<span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>/mo</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3, color: b.paymentStatus === "paid" ? C.success : C.warning, textTransform: "capitalize" }}>
                {b.paymentStatus}
              </div>
              {b.status === "confirmed" && onCancel && (
                <button onClick={() => onCancel(b._id)} disabled={cancelling === b._id}
                  style={{ marginTop: 10, padding: "6px 14px", background: "#ef444415", border: "1px solid #ef444440", borderRadius: 8, color: C.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {cancelling === b._id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}