import { useState } from "react";
import { hostelAPI } from "../../api/axios";
import { COLORS, HOSTEL_TYPES } from "../../utils/constants";

const C = COLORS;

const EMPTY = {
  name: "", description: "", address: "", city: "",
  lat: "", lng: "", type: "mixed",
  totalRooms: "", pricePerMonth: "", amenities: "",
};

export default function HostelForm({ initial = null, onSuccess, onCancel }) {
  const editing = !!initial;
  const [form,    setForm]    = useState(initial
    ? {
        name: initial.name, description: initial.description || "",
        address: initial.location?.address || "", city: initial.location?.city || "",
        lat: initial.location?.coordinates?.coordinates?.[1] || "",
        lng: initial.location?.coordinates?.coordinates?.[0] || "",
        type: initial.type, totalRooms: initial.totalRooms,
        pricePerMonth: initial.pricePerMonth,
        amenities: (initial.amenities || []).join(", "),
      }
    : EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const detectGPS = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((p) => ({ ...p, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) })),
      () => setError("Location permission denied")
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      };
      if (editing) await hostelAPI.update(initial._id, payload);
      else         await hostelAPI.create(payload);
      onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input
        name={name} value={form[name]} onChange={set}
        {...extra}
        style={{ width: "100%", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = C.accent)}
        onBlur={(e)  => (e.target.style.borderColor = C.border)}
      />
    </div>
  );

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 22 }}>
        {editing ? "✏️ Edit Hostel" : "🏨 Add New Hostel"}
      </div>

      {error && (
        <div style={{ background: "#ef444415", border: "1px solid #ef444440", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: C.danger, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {field("name",         "Hostel Name",       { placeholder: "Sunrise Hostel",        required: true })}
          {field("city",         "City",              { placeholder: "Bangalore",              required: true })}
          {field("address",      "Full Address",      { placeholder: "12th Main, Koramangala", required: true })}
          {field("pricePerMonth","Price / Month (₹)", { placeholder: "8500",  type: "number",  required: true })}
          {field("totalRooms",   "Total Rooms",       { placeholder: "80",    type: "number",  required: true })}

          {/* Type select */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</label>
            <select name="type" value={form.type} onChange={set}
              style={{ width: "100%", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none" }}>
              {HOSTEL_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GPS */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            GPS Coordinates <span style={{ color: C.accent }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {["lat", "lng"].map((k) => (
              <input key={k} name={k} value={form[k]} onChange={set}
                placeholder={k === "lat" ? "Latitude  e.g. 12.9352" : "Longitude  e.g. 77.6245"}
                style={{ flex: 1, padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 13, outline: "none", fontFamily: "monospace" }}
                onFocus={(e) => (e.target.style.borderColor = C.accent)}
                onBlur={(e)  => (e.target.style.borderColor = C.border)}
              />
            ))}
            <button type="button" onClick={detectGPS}
              style={{ padding: "10px 16px", background: `${C.accent}18`, border: `1px solid ${C.accent}50`, borderRadius: 10, color: C.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
              📍 Detect
            </button>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>Required for nearby student search</div>
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amenities (comma separated)</label>
          <input name="amenities" value={form.amenities} onChange={set} placeholder="WiFi, AC, Gym, Cafeteria, Laundry"
            style={{ width: "100%", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e)  => (e.target.style.borderColor = C.border)}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Description (optional)</label>
          <textarea name="description" value={form.description} onChange={set} rows={3}
            placeholder="Brief description..."
            style={{ width: "100%", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e)  => (e.target.style.borderColor = C.border)}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving}
            style={{ padding: "11px 28px", background: saving ? C.border : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : editing ? "Update Hostel" : "Add Hostel"}
          </button>
          <button type="button" onClick={onCancel}
            style={{ padding: "11px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 12, color: C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}