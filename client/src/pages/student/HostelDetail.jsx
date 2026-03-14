import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar    from "../../components/common/Sidebar";
import Navbar     from "../../components/common/Navbar";
import { hostelAPI } from "../../api/axios";
import { useBookings } from "../../hooks/useBookings";
import { COLORS } from "../../utils/constants";
import { formatCurrency, occupancyRate } from "../../utils/helpers";

const C = COLORS;

export default function HostelDetail() {
  const { id }                   = useParams();
  const navigate                 = useNavigate();
  const { createBooking }        = useBookings(false);
  const [hostel,   setHostel]    = useState(null);
  const [loading,  setLoading]   = useState(true);
  const [dates,    setDates]     = useState({ checkIn: "", checkOut: "" });
  const [bookErr,  setBookErr]   = useState("");
  const [bookOk,   setBookOk]    = useState("");
  const [booking,  setBooking]   = useState(false);

  useEffect(() => {
    hostelAPI.getById(id)
      .then((r) => setHostel(r.data.hostel))
      .catch(() => navigate("/dashboard/hostels"))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async () => {
    if (!dates.checkIn || !dates.checkOut) return setBookErr("Please select both dates.");
    setBooking(true); setBookErr("");
    const res = await createBooking({ hostelId: id, checkInDate: dates.checkIn, checkOutDate: dates.checkOut });
    if (res.success) {
      setBookOk(res.data.message || "Booking confirmed!");
      setDates({ checkIn: "", checkOut: "" });
    } else {
      setBookErr(res.message);
    }
    setBooking(false);
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
        <Sidebar />
        <div style={{ marginLeft: 240, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
          Loading hostel details...
        </div>
      </div>
    );
  }

  if (!hostel) return null;

  const occ   = occupancyRate(hostel.totalRooms, hostel.availableRooms);
  const color = occ > 85 ? C.danger : occ > 60 ? C.warning : C.success;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title={hostel.name} subtitle={`${hostel.location?.city} · ${hostel.type} hostel`} />

        <div style={{ padding: "28px 32px", color: C.text }}>
          <button onClick={() => navigate(-1)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, padding: "7px 16px", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>
            ← Back
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

            {/* Left: details */}
            <div>
              {/* Hero card */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 28px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{hostel.name}</div>
                    <div style={{ fontSize: 14, color: C.muted }}>📍 {hostel.location?.address}, {hostel.location?.city}</div>
                  </div>
                  <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${C.accent}18`, color: C.accent, textTransform: "capitalize" }}>
                    {hostel.type}
                  </span>
                </div>

                {hostel.description && (
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{hostel.description}</p>
                )}

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, padding: "18px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
                  {[
                    { label: "Total Rooms",     value: hostel.totalRooms,     color: C.text     },
                    { label: "Available",        value: hostel.availableRooms, color: hostel.availableRooms === 0 ? C.danger : C.success },
                    { label: "Monthly Rent",     value: formatCurrency(hostel.pricePerMonth), color: C.accent },
                    { label: "Occupancy",        value: `${occ}%`,             color            },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Occupancy bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
                    <span>Occupancy</span>
                    <span style={{ color, fontWeight: 700 }}>{occ}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${occ}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                </div>

                {/* Availability badge */}
                <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 12, background: hostel.availableRooms === 0 ? "#ef444415" : "#10b98115", border: `1px solid ${hostel.availableRooms === 0 ? "#ef444430" : "#10b98130"}`, color: hostel.availableRooms === 0 ? C.danger : C.success, fontSize: 14, fontWeight: 700 }}>
                  {hostel.availableRooms === 0 ? "🔴 Currently Full" : `🟢 ${hostel.availableRooms} Rooms Available`}
                </div>
              </div>

              {/* Amenities */}
              {hostel.amenities?.length > 0 && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 26px", marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🛎️ Amenities</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {hostel.amenities.map((a) => (
                      <span key={a} style={{ padding: "7px 14px", borderRadius: 10, fontSize: 13, background: `${C.accent}12`, border: `1px solid ${C.accent}25`, color: C.accent, fontWeight: 500 }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {hostel.location?.coordinates?.coordinates && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 26px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📍 Location</div>
                  <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>{hostel.location.address}, {hostel.location.city}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>
                    {hostel.location.coordinates.coordinates[1]}°N, {hostel.location.coordinates.coordinates[0]}°E
                  </div>
                </div>
              )}
            </div>

            {/* Right: booking card */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", position: "sticky", top: 20 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, marginBottom: 2 }}>
                {formatCurrency(hostel.pricePerMonth)}
                <span style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: hostel.availableRooms === 0 ? C.danger : C.success, fontWeight: 600, marginBottom: 22 }}>
                {hostel.availableRooms === 0 ? "No rooms available — join waiting list" : `${hostel.availableRooms} rooms available`}
              </div>

              {bookErr && (
                <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, padding: "10px 13px", marginBottom: 14, color: C.danger, fontSize: 13 }}>
                  {bookErr}
                </div>
              )}
              {bookOk && (
                <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: "10px 13px", marginBottom: 14, color: C.success, fontSize: 13 }}>
                  ✅ {bookOk}
                </div>
              )}

              {[
                { label: "Check-In Date",  key: "checkIn",  min: today },
                { label: "Check-Out Date", key: "checkOut", min: dates.checkIn || today },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                  <input type="date" min={f.min} value={dates[f.key]}
                    onChange={(e) => setDates((p) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e)  => (e.target.style.borderColor = C.border)}
                  />
                </div>
              ))}

              <button onClick={submit} disabled={booking}
                style={{ width: "100%", padding: 13, marginTop: 6, background: booking ? C.border : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 15, cursor: booking ? "not-allowed" : "pointer" }}>
                {booking ? "Processing..." : hostel.availableRooms === 0 ? "Join Waiting List" : "Book Now →"}
              </button>

              <div style={{ marginTop: 18, padding: "14px", background: `${C.accent}08`, borderRadius: 10, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                {hostel.availableRooms === 0
                  ? "⏳ You'll be placed in a queue and auto-assigned when a room opens up."
                  : "✅ Booking is confirmed immediately. Cancel anytime before check-in."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}