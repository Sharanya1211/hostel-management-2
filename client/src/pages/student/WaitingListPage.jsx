import { useState, useEffect } from "react";
import Sidebar             from "../../components/common/Sidebar";
import Navbar              from "../../components/common/Navbar";
import WaitingListStatus   from "../../components/student/WaitingListStatus";
import { waitingAPI }      from "../../api/axios";
import { COLORS }          from "../../utils/constants";

const C = COLORS;

export default function StudentWaitingPage() {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [leaving, setLeaving]   = useState(null);
  const [message, setMessage]   = useState("");

  const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 4000); };

  const load = () => {
    setLoading(true);
    waitingAPI.getMine()
      .then((r) => setEntries(r.data.waitingList))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleLeave = async (id) => {
    if (!confirm("Leave this waiting list?")) return;
    setLeaving(id);
    try {
      await waitingAPI.remove(id);
      flash("You have left the waiting list.");
      load();
    } catch (e) {
      flash(e.message || "Failed to leave");
    } finally {
      setLeaving(null);
    }
  };

  const waiting = entries.filter((e) => e.status === "waiting");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar
          title="My Waiting List"
          subtitle={waiting.length > 0
            ? `You are waiting for ${waiting.length} hostel${waiting.length > 1 ? "s" : ""}`
            : "You are not on any waiting list"}
        />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {message && (
            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 12, padding: "12px 18px", marginBottom: 22, color: C.success, fontSize: 14 }}>
              ✅ {message}
            </div>
          )}

          {loading
            ? <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading...</div>
            : (
              <>
                <WaitingListStatus entries={entries} onLeave={handleLeave} leaving={leaving} />

                {entries.length === 0 && (
                  <div style={{ marginTop: 20, textAlign: "center" }}>
                    <a href="/dashboard/hostels"
                      style={{ display: "inline-block", padding: "11px 26px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 12, color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                      Browse Hostels
                    </a>
                  </div>
                )}
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}