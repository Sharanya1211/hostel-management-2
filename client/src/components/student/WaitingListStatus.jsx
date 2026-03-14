import { COLORS } from "../../utils/constants";
import { formatDate, daysBetween, formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function WaitingListStatus({ entries, onLeave, leaving }) {
  if (!entries.length) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⏳</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>Not on any waiting list</div>
        <div style={{ fontSize: 14, color: C.muted }}>When a hostel is full, you can join its waiting list and get auto-assigned when a room opens.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {entries.map((e) => {
        const days      = daysBetween(e.createdAt);
        const isWaiting = e.status === "waiting";

        return (
          <div key={e._id} style={{ background: C.surface, border: `1px solid ${isWaiting ? C.warning + "40" : C.success + "40"}`, borderRadius: 16, padding: "22px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                {/* Hostel */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{e.hostelId?.name || "Hostel"}</div>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: isWaiting ? `${C.warning}15` : `${C.success}15`, color: isWaiting ? C.warning : C.success }}>
                    {isWaiting ? "⏳ Waiting" : "✅ Assigned"}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
                  📍 {e.hostelId?.location?.city} · {formatCurrency(e.hostelId?.pricePerMonth)}/mo
                </div>

                {isWaiting && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
                      <div style={{ textAlign: "center", background: `${C.warning}12`, border: `2px solid ${C.warning}40`, borderRadius: 12, padding: "12px 22px" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: C.warning }}>#{e.position}</div>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Queue Position</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                          {days === 0 ? "Joined today" : `${days} day${days > 1 ? "s" : ""} waiting`}
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Since {formatDate(e.createdAt)}</div>
                      </div>
                    </div>

                    <div style={{ background: `${C.accent}08`, border: `1px solid ${C.accent}20`, borderRadius: 10, padding: "11px 15px" }}>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                        {e.position === 1
                          ? "🎯 You're #1! A room will be auto-assigned to you the moment someone cancels."
                          : `${e.position - 1} student${e.position - 1 > 1 ? "s" : ""} ahead of you. You'll be auto-assigned when it's your turn.`}
                      </div>
                    </div>
                  </>
                )}

                {!isWaiting && (
                  <div style={{ background: `${C.success}10`, border: `1px solid ${C.success}30`, borderRadius: 10, padding: "11px 15px" }}>
                    <div style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
                      🎉 Room assigned! Check your Bookings page for details.
                    </div>
                  </div>
                )}
              </div>

              {isWaiting && onLeave && (
                <button onClick={() => onLeave(e._id)} disabled={leaving === e._id}
                  style={{ marginLeft: 20, padding: "8px 16px", background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, color: C.danger, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                  {leaving === e._id ? "Leaving..." : "Leave Queue"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}