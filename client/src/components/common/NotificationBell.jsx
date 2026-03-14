import { useState } from "react";
import { COLORS } from "../../utils/constants";

const C = COLORS;

// In a real app you'd fetch these from an API
const MOCK_NOTIFICATIONS = [
  { id: 1, type: "success", text: "Your booking was confirmed.",        time: "2 min ago",  read: false },
  { id: 2, type: "warning", text: "Rent payment due in 3 days.",        time: "1 hour ago", read: false },
  { id: 3, type: "info",    text: "Hostel maintenance on Sunday.",       time: "Yesterday",  read: true  },
  { id: 4, type: "success", text: "Room assigned from waiting list!",    time: "2 days ago", read: true  },
];

const typeIcon  = { success: "✅", warning: "⚠️", info: "ℹ️", error: "❌" };
const typeColor = { success: "#10b981", warning: "#f59e0b", info: "#3b82f6", error: "#ef4444" };

export default function NotificationBell() {
  const [open,  setOpen]  = useState(false);
  const [notes, setNotes] = useState(MOCK_NOTIFICATIONS);

  const unread = notes.filter((n) => !n.read).length;

  const markAllRead = () => setNotes((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: C.card, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 17, position: "relative",
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 8, height: 8, borderRadius: "50%",
            background: "#ef4444", border: `2px solid ${C.surface}`,
          }} />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 98 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: "absolute", top: 48, right: 0,
            width: 320, background: C.surface,
            border: `1px solid ${C.border}`, borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            zIndex: 99, overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              padding: "14px 18px", borderBottom: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                Notifications {unread > 0 && (
                  <span style={{
                    marginLeft: 6, background: "#ef444420", color: "#ef4444",
                    fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                  }}>{unread} new</span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  style={{ fontSize: 12, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notes.map((n) => (
                <div key={n.id} style={{
                  padding: "12px 18px",
                  borderBottom: `1px solid ${C.border}`,
                  background: n.read ? "transparent" : `${typeColor[n.type]}06`,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{typeIcon[n.type]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: n.read ? C.muted : C.text, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{n.time}</div>
                  </div>
                  {!n.read && (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: typeColor[n.type], flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}