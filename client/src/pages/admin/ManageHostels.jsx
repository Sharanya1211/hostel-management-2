import { useState } from "react";
import Sidebar     from "../../components/common/Sidebar";
import Navbar      from "../../components/common/Navbar";
import HostelForm  from "../../components/admin/HostelForm";
import { useHostels } from "../../hooks/useHostels";
import { COLORS }  from "../../utils/constants";
import { occupancyRate, formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function ManageHostels() {
  const { hostels, loading, fetchAll } = useHostels(true);
  const [showForm, setShowForm]        = useState(false);
  const [editing,  setEditing]         = useState(null);   // hostel object or null
  const [success,  setSuccess]         = useState("");

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3500); };

  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    fetchAll();
    flash(editing ? "Hostel updated successfully!" : "Hostel added successfully!");
  };

  const openEdit = (h) => { setEditing(h); setShowForm(true); };
  const openAdd  = ()  => { setEditing(null); setShowForm(true); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title="Manage Hostels" subtitle={`${hostels.length} registered hostels`} />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button onClick={openAdd}
              style={{ padding: "11px 22px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              + Add Hostel
            </button>
          </div>

          {success && (
            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: C.success, fontSize: 14 }}>
              ✅ {success}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <HostelForm
              initial={editing}
              onSuccess={handleSuccess}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          )}

          {/* Table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading hostels...</div>
            ) : hostels.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏨</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>No hostels yet</div>
                <div style={{ fontSize: 14, color: C.muted }}>Click "+ Add Hostel" to register your first property.</div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name", "Location", "Type", "Rooms", "Available", "Price", "Occupancy", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((h) => {
                    const occ   = occupancyRate(h.totalRooms, h.availableRooms);
                    const color = occ > 85 ? C.danger : occ > 60 ? C.warning : C.success;
                    return (
                      <tr key={h._id}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <td style={{ padding: "13px 18px", fontSize: 14, fontWeight: 600, color: C.text }}>{h.name}</td>
                        <td style={{ padding: "13px 18px", fontSize: 13, color: C.muted }}>{h.location?.city}</td>
                        <td style={{ padding: "13px 18px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${C.accent}18`, color: C.accent, textTransform: "capitalize" }}>{h.type}</span>
                        </td>
                        <td style={{ padding: "13px 18px", fontSize: 14, color: C.text }}>{h.totalRooms}</td>
                        <td style={{ padding: "13px 18px", fontSize: 14, fontWeight: 700, color: h.availableRooms === 0 ? C.danger : C.success }}>{h.availableRooms}</td>
                        <td style={{ padding: "13px 18px", fontSize: 14, color: C.text }}>{formatCurrency(h.pricePerMonth)}</td>
                        <td style={{ padding: "13px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 60, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${occ}%`, background: color, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color, fontWeight: 700 }}>{occ}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "13px 18px" }}>
                          <button onClick={() => openEdit(h)}
                            style={{ padding: "6px 14px", background: `${C.accent}18`, border: `1px solid ${C.accent}40`, borderRadius: 8, color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Edit
                          </button>
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