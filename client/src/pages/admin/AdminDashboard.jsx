import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { hostelAPI, bookingAPI, waitingAPI } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../utils/constants";

const C = COLORS;

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: color, margin: "6px 0 4px" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [waiting, setWaiting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const h = await hostelAPI.getAll();
        const b = await bookingAPI.getAll();
        const w = await waitingAPI.getAll();
        setHostels(h.data.hostels || []);
        setBookings(b.data.bookings || []);
        setWaiting(w.data.waitingList || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRooms = hostels.reduce(function(s, h) { return s + (h.totalRooms || 0); }, 0);
  const availableRooms = hostels.reduce(function(s, h) { return s + (h.availableRooms || 0); }, 0);
  const activeBookings = bookings.filter(function(b) { return b.status === "confirmed"; }).length;
  const waitingCount = waiting.filter(function(w) { return w.status === "waiting"; }).length;
  const occ = totalRooms ? (((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1 }}>
        <Navbar title="Admin Dashboard" subtitle={"Welcome back, " + (user ? user.name : "")} />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {error && (
            <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: C.danger, fontSize: 14 }}>
              Error: {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 28 }}>
            <StatCard icon="🏨" label="Total Hostels"   value={loading ? "..." : hostels.length}  color={C.accent}  sub="Active properties" />
            <StatCard icon="🚪" label="Available Rooms" value={loading ? "..." : availableRooms}  color={C.success} sub={"of " + totalRooms + " total"} />
            <StatCard icon="📋" label="Active Bookings" value={loading ? "..." : activeBookings}  color={C.warning} sub="Confirmed" />
            <StatCard icon="⏳" label="Waiting"         value={loading ? "..." : waitingCount}    color={C.danger}  sub="Students queued" />
          </div>

          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Overall Occupancy</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{occ}%</div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: occ + "%", background: C.accent, borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }}>

            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Bookings</div>
                <a href="/admin/bookings" style={{ fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600 }}>View all</a>
              </div>
              {loading && <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading...</div>}
              {!loading && bookings.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No bookings yet.</div>}
              {!loading && bookings.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid " + C.border }}>Student</th>
                      <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid " + C.border }}>Hostel</th>
                      <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid " + C.border }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 7).map(function(b) {
                      return (
                        <tr key={b._id}>
                          <td style={{ padding: "12px 18px", fontSize: 13, color: C.text }}>{b.userId ? b.userId.name : "—"}</td>
                          <td style={{ padding: "12px 18px", fontSize: 13, color: C.muted }}>{b.hostelId ? b.hostelId.name : "—"}</td>
                          <td style={{ padding: "12px 18px", fontSize: 12, color: C.muted, textTransform: "capitalize" }}>{b.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Hostel Status</div>
                <a href="/admin/hostels" style={{ fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600 }}>Manage</a>
              </div>
              {loading && <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading...</div>}
              {!loading && hostels.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No hostels yet.</div>}
              {!loading && hostels.length > 0 && hostels.slice(0, 6).map(function(h) {
                var o = h.totalRooms ? (((h.totalRooms - h.availableRooms) / h.totalRooms) * 100).toFixed(0) : 0;
                var color = o > 85 ? C.danger : o > 60 ? C.warning : C.success;
                return (
                  <div key={h._id} style={{ padding: "14px 22px", borderBottom: "1px solid " + C.border }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{h.availableRooms} of {h.totalRooms} available</div>
                    <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: o + "%", background: color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
