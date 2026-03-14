import { COLORS } from "../../utils/constants";
import { formatDate, daysBetween } from "../../utils/helpers";

const C = COLORS;

export default function WaitingListManager({ entries, onAssign, onRemove, assigning }) {
  if (!entries.length) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>No one waiting!</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>All students have been accommodated.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["#", "Student", "Email", "Hostel", "Since", "Days", "Status", "Actions"].map((h) => (
              <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const days      = daysBetween(e.createdAt);
            const isWaiting = e.status === "waiting";
            return (
              <tr key={e._id}
                onMouseEnter={(el) => (el.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(el) => (el.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "13px 18px" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: e.position === 1 ? `${C.warning}20` : "rgba(255,255,255,0.05)", color: e.position === 1 ? C.warning : C.muted, border: `2px solid ${e.position === 1 ? C.warning : C.border}` }}>
                    {e.position}
                  </div>
                </td>
                <td style={{ padding: "13px 18px", fontSize: 14, fontWeight: 600, color: C.text }}>{e.userId?.name || "—"}</td>
                <td style={{ padding: "13px 18px", fontSize: 12, color: C.muted }}>{e.userId?.email || "—"}</td>
                <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{e.hostelId?.name || "—"}</td>
                <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{formatDate(e.createdAt)}</td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: days > 7 ? C.danger : days > 3 ? C.warning : C.success }}>
                    {days}d
                  </span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: isWaiting ? `${C.warning}15` : `${C.success}15`, color: isWaiting ? C.warning : C.success, textTransform: "capitalize" }}>
                    {e.status}
                  </span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {isWaiting && onAssign && (
                      <button onClick={() => onAssign(e._id)} disabled={assigning === e._id}
                        style={{ padding: "5px 12px", background: `${C.success}18`, border: `1px solid ${C.success}40`, borderRadius: 8, color: C.success, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {assigning === e._id ? "..." : "Assign"}
                      </button>
                    )}
                    {onRemove && (
                      <button onClick={() => onRemove(e._id)}
                        style={{ padding: "5px 12px", background: "#ef444415", border: "1px solid #ef444440", borderRadius: 8, color: C.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}