import { COLORS } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";

const C = COLORS;

export default function HostelCard({ hostel, onBook }) {
  const { name, location, type, pricePerMonth, availableRooms, rating, amenities, distance } = hostel;

  return (
    <div
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s", cursor: "pointer" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.35)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none";              e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Header strip */}
      <div style={{ padding: "18px 20px 12px", background: C.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>📍 {location?.address}, {location?.city}</div>
          </div>
          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${C.accent}18`, color: C.accent, textTransform: "capitalize", flexShrink: 0 }}>
            {type}
          </span>
        </div>

        {/* Distance badge (only for nearby search) */}
        {distance !== undefined && distance !== null && (
          <div style={{ marginTop: 7, fontSize: 12, fontWeight: 700, color: C.accent }}>
            📏 {distance} km from you
          </div>
        )}
      </div>

      <div style={{ padding: "12px 20px 18px" }}>
        {/* Rating */}
        {rating > 0 && (
          <div style={{ fontSize: 13, color: "#f59e0b", marginBottom: 10 }}>
            {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
            <span style={{ color: C.muted, marginLeft: 4 }}>{rating}</span>
          </div>
        )}

        {/* Amenities */}
        {amenities?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
            {amenities.slice(0, 4).map((a) => (
              <span key={a} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, background: "rgba(255,255,255,0.06)", color: C.muted }}>{a}</span>
            ))}
            {amenities.length > 4 && (
              <span style={{ fontSize: 11, color: C.muted }}>+{amenities.length - 4} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{formatCurrency(pricePerMonth)}</span>
            <span style={{ fontSize: 12, color: C.muted }}>/mo</span>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: availableRooms === 0 ? C.danger : C.success }}>
              {availableRooms === 0 ? "🔴 Full" : `🟢 ${availableRooms} rooms available`}
            </div>
          </div>
          <button
            onClick={() => onBook(hostel)}
            style={{ padding: "9px 18px", background: availableRooms === 0 ? "transparent" : "linear-gradient(135deg,#3b82f6,#6366f1)", border: availableRooms === 0 ? `1px solid ${C.border}` : "none", borderRadius: 10, color: availableRooms === 0 ? C.muted : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            {availableRooms === 0 ? "Join Waitlist" : "Book Now →"}
          </button>
        </div>
      </div>
    </div>
  );
}