import { COLORS, STATUS_STYLES } from "../../utils/constants";
import { formatDate, formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function BookingTable({ bookings, onCancel, showStudent = true }) {
  if (!bookings.length) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: C.muted }}>
        No bookings found.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              ...(showStudent ? ["Student"] : []),
              "Hostel", "Check-In", "Check-Out", "Status", "Payment", "Action",
            ].map((h) => (
              <th key={h} style={{
                padding: "11px 18px", textAlign: "left",
                fontSize: 11, color: C.muted, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.02)",
                borderBottom: `1px solid ${C.border}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
            return (
              <tr key={b._id}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {showStudent && (
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{b.userId?.name || "—"}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{b.userId?.email}</div>
                  </td>
                )}
                <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{b.hostelId?.name || "—"}</td>
                <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{formatDate(b.checkInDate)}</td>
                <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{formatDate(b.checkOutDate)}</td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, textTransform: "capitalize" }}>
                    {st.label}
                  </span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.paymentStatus === "paid" ? "#10b98115" : "#f59e0b15", color: b.paymentStatus === "paid" ? "#10b981" : "#f59e0b", textTransform: "capitalize" }}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  {b.status === "confirmed" && onCancel && (
                    <button onClick={() => onCancel(b._id)}
                      style={{ padding: "5px 12px", background: "#ef444415", border: "1px solid #ef444440", borderRadius: 8, color: C.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}