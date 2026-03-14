import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import HostelCard from "../../components/student/HostelCard";
import { useHostels } from "../../hooks/useHostels";
import { useBookings } from "../../hooks/useBookings";
import { COLORS } from "../../utils/constants";

const C = COLORS;

export default function HostelList() {
  const { hostels, loading, fetchAll, fetchNearby, detectAndFetchNearby } = useHostels(true);
  const { createBooking } = useBookings(false);

  const [mode,        setMode]        = useState("all");
  const [radius,      setRadius]      = useState(5);
  const [filterType,  setFilterType]  = useState("all");
  const [search,      setSearch]      = useState("");
  const [city,        setCity]        = useState("");
  const [locating,    setLocating]    = useState(false);
  const [booking,     setBooking]     = useState(null);
  const [dates,       setDates]       = useState({ checkIn: "", checkOut: "" });
  const [bookError,   setBookError]   = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [successMsg,  setSuccessMsg]  = useState("");

  const handleNearMe = async () => {
    setLocating(true);
    setMode("nearby");
    setCity("");
    await detectAndFetchNearby({ radius });
    setLocating(false);
  };

  const handleCitySearch = async () => {
    if (!city.trim()) return;
    setMode("city");
    await fetchAll({ city: city.trim(), type: filterType === "all" ? undefined : filterType });
  };

  const handleShowAll = () => {
    setMode("all");
    setCity("");
    fetchAll();
  };

  const handleRadiusChange = async (val) => {
    setRadius(val);
    if (mode === "nearby") {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await fetchNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude, radius: val });
      });
    }
  };

  const openBook = (hostel) => {
    setBooking(hostel);
    setDates({ checkIn: "", checkOut: "" });
    setBookError("");
  };

  const submitBook = async () => {
    if (!dates.checkIn || !dates.checkOut) return setBookError("Please select both dates.");
    setBookLoading(true); setBookError("");
    const result = await createBooking({
      hostelId:    booking._id,
      checkInDate: dates.checkIn,
      checkOutDate: dates.checkOut,
    });
    if (result.success) {
      setBooking(null);
      setSuccessMsg(result.data.message || "Booking successful!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAll();
    } else {
      setBookError(result.message);
    }
    setBookLoading(false);
  };

  const displayed = hostels.filter(function(h) {
    var matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      (h.location && h.location.city && h.location.city.toLowerCase().includes(search.toLowerCase()));
    var matchType = filterType === "all" || h.type === filterType;
    return matchSearch && matchType;
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title="Find Hostels" subtitle="Search by name, city or find hostels near you" />

        <div style={{ padding: "28px 32px", color: C.text }}>

          {successMsg && (
            <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: C.success, fontSize: 14 }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Search controls */}
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>

            {/* Row 1: text search + type filter */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "0 14px" }}>
                <span>🔍</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, padding: "10px 0" }} />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 10, color: C.text, fontSize: 14, outline: "none" }}>
                <option value="all">All Types</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Row 2: city search */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "0 14px" }}>
                <span>🏙️</span>
                <input value={city} onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
                  placeholder="Search by city  e.g. Hyderabad, Bangalore..."
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, padding: "10px 0" }} />
              </div>
              <button onClick={handleCitySearch}
                style={{ padding: "10px 20px", background: mode === "city" ? C.accent : C.card, border: "1px solid " + (mode === "city" ? C.accent : C.border), borderRadius: 10, color: mode === "city" ? "#fff" : C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Search City
              </button>
            </div>

            {/* Row 3: near me + radius */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={handleNearMe} disabled={locating}
                style={{ padding: "10px 18px", background: mode === "nearby" ? C.accent + "25" : C.card, border: "1px solid " + (mode === "nearby" ? C.accent : C.border), borderRadius: 10, color: mode === "nearby" ? C.accent : C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                {locating ? "📡 Detecting..." : "📍 Near Me"}
              </button>

              {mode === "nearby" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "0 16px" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>Radius</span>
                  <input type="range" min="1" max="20" value={radius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    style={{ width: 80, accentColor: C.accent }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, minWidth: 40 }}>{radius} km</span>
                </div>
              )}

              {mode !== "all" && (
                <button onClick={handleShowAll}
                  style={{ padding: "10px 14px", background: "transparent", border: "1px solid " + C.border, borderRadius: 10, color: C.muted, fontSize: 13, cursor: "pointer" }}>
                  ✕ Clear Filter
                </button>
              )}

              {/* Mode badge */}
              {mode === "nearby" && (
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>
                  📍 Showing hostels within {radius}km of your location
                </div>
              )}
              {mode === "city" && city && (
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>
                  🏙️ Showing hostels in "{city}"
                </div>
              )}
            </div>
          </div>

          {/* Result count */}
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>
            {loading ? "Searching..." : (
              <span><span style={{ color: C.text, fontWeight: 700 }}>{displayed.length}</span> hostels found</span>
            )}
          </div>

          {/* Hostel grid */}
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading hostels...</div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", background: C.surface, borderRadius: 16, border: "1px solid " + C.border }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏨</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>No hostels found</div>
              <div style={{ fontSize: 14, color: C.muted }}>Try a different city, wider radius, or clear the filter.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
              {displayed.map(function(h) {
                return <HostelCard key={h._id} hostel={h} onBook={openBook} />;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {booking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#0e1628", border: "1px solid " + C.border, borderRadius: 20, padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>
              {booking.availableRooms === 0 ? "Join Waiting List" : "Book Room"}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{booking.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
              📍 {booking.location ? booking.location.city : ""} · ₹{booking.pricePerMonth ? booking.pricePerMonth.toLocaleString() : "—"}/mo
            </div>

            {bookError && (
              <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: C.danger, fontSize: 13 }}>
                {bookError}
              </div>
            )}

            {[
              { label: "Check-In Date",  key: "checkIn",  min: today },
              { label: "Check-Out Date", key: "checkOut", min: dates.checkIn || today },
            ].map(function(f) {
              return (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                  <input type="date" min={f.min} value={dates[f.key]}
                    onChange={(e) => setDates(function(p) { return { ...p, [f.key]: e.target.value }; })}
                    style={{ width: "100%", padding: "11px 14px", background: "#111827", border: "1px solid " + C.border, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                    onBlur={(e)  => (e.target.style.borderColor = C.border)} />
                </div>
              );
            })}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={submitBook} disabled={bookLoading}
                style={{ flex: 1, padding: 12, background: bookLoading ? C.border : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: bookLoading ? "not-allowed" : "pointer" }}>
                {bookLoading ? "Processing..." : booking.availableRooms === 0 ? "Join Waiting List" : "Confirm Booking"}
              </button>
              <button onClick={() => setBooking(null)}
                style={{ padding: "12px 18px", background: "transparent", border: "1px solid " + C.border, borderRadius: 12, color: C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}