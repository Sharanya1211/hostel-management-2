import { useState, useEffect } from "react";
import Sidebar            from "../../components/common/Sidebar";
import Navbar             from "../../components/common/Navbar";
import WaitingListManager from "../../components/admin/WaitingListManager";
import { waitingAPI }     from "../../api/axios";
import { COLORS }         from "../../utils/constants";

const C = COLORS;

export default function WaitingListPage() {
  const [entries,   setEntries]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [msg,       setMsg]       = useState({ text: "", type: "" });

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  const load = () => {
    setLoading(true);
    waitingAPI.getAll()
      .then((r) => setEntries(r.data.waitingList))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (id) => {
    setAssigning(id);
    try {
      await waitingAPI.assign(id);
      flash("Room assigned successfully! Booking created for student.");
      load();
    } catch (e) {
      flash(e.message || "Assignment failed", "error");
    } finally {
      setAssigning(null);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this student from the waiting list?")) return;
    try {
      await waitingAPI.remove(id);
      flash("Entry removed.");
      load();
    } catch (e) {
      flash(e.message || "Failed", "error");
    }
  };

  const waitingOnly  = entries.filter((e) => e.status === "waiting");
  const assignedOnly = entries.filter((e) => e.status === "assigned");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title="Waiting List" subtitle={`${waitingOnly.length} students currently waiting`} />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 26 }}>
            {[
              { label: "Waiting",          value: waitingOnly.length,  color: C.warning, icon: "⏳" },
              { label: "Assigned Today",   value: assignedOnly.length, color: C.success, icon: "✅" },
              { label: "Hostels w/ Queue", value: new Set(waitingOnly.map((e) => e.hostelId?._id)).size, color: C.accent, icon: "🏨" },
            ].map((s) => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 30, opacity: 0.85 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{loading ? "—" : s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {msg.text && (
            <div style={{ background: msg.type === "error" ? "#ef444415" : "#10b98115", border: `1px solid ${msg.type === "error" ? "#ef444440" : "#10b98140"}`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: msg.type === "error" ? C.danger : C.success, fontSize: 14 }}>
              {msg.type === "error" ? "⚠️" : "✅"} {msg.text}
            </div>
          )}

          {/* Table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>All Waiting Entries</div>
            </div>
            {loading
              ? <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading...</div>
              : <WaitingListManager entries={entries} onAssign={handleAssign} onRemove={handleRemove} assigning={assigning} />
            }
          </div>

          {/* Auto-assign info */}
          <div style={{ marginTop: 18, background: `${C.accent}08`, border: `1px solid ${C.accent}20`, borderRadius: 14, padding: "14px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 5 }}>💡 Auto-assign is active</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              When a student cancels a booking, the system <strong style={{ color: C.text }}>automatically</strong> creates a confirmed booking for position #1 in that hostel's queue — no manual action needed. Use "Assign" above only for manual overrides.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}