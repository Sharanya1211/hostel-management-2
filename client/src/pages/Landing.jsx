import { useNavigate } from "react-router-dom";
import { COLORS } from "../utils/constants";

const C = COLORS;

const FEATURES = [
  { icon: "🏨", title: "500+ Hostels",       desc: "Browse verified hostels across all major cities in India" },
  { icon: "📍", title: "Location Search",    desc: "Find hostels near your college using GPS or city search" },
  { icon: "⚡", title: "Instant Booking",    desc: "Book your room in seconds, get confirmation immediately" },
  { icon: "⏳", title: "Smart Waiting List", desc: "Auto-assigned a room the moment one becomes available" },
  { icon: "🔒", title: "Secure & Verified",  desc: "All hostels are verified by our admin team" },
  { icon: "💰", title: "Best Prices",        desc: "Transparent pricing with no hidden charges" },
];

const QUOTES = [
  { text: "Finding the right hostel is the first step to a great college life.", author: "HostelPro Team" },
  { text: "Safe, affordable, and close to your campus — that's our promise.", author: "HostelPro Team" },
  { text: "Thousands of students found their home away from home with us.", author: "HostelPro Team" },
];

const STATS = [
  { value: "500+",  label: "Hostels Listed"   },
  { value: "10K+",  label: "Students Housed"  },
  { value: "50+",   label: "Cities Covered"   },
  { value: "98%",   label: "Satisfaction Rate" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.text }}>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: "1px solid " + C.border, position: "sticky", top: 0, background: C.bg, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏨</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>HostelPro</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: -2 }}>Student Housing Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "9px 22px", background: "transparent", border: "1px solid " + C.border, borderRadius: 10, color: C.muted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "9px 22px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "80px 48px 60px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, #3b82f620 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, #1e2d4515 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", padding: "6px 16px", background: "#3b82f615", border: "1px solid #3b82f630", borderRadius: 20, fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 24, letterSpacing: "0.05em" }}>
          🎓 INDIA'S #1 STUDENT HOSTEL PLATFORM
        </div>

        <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20, maxWidth: 700, margin: "0 auto 20px" }}>
          Find Your Perfect
          <span style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
            Student Hostel
          </span>
        </h1>

        <p style={{ fontSize: 18, color: C.muted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Search verified hostels near your college, book instantly, and get auto-assigned when rooms open up — all in one place.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "14px 32px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px #3b82f640" }}
          >
            🎓 Register as Student
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "14px 32px", background: "transparent", border: "1px solid " + C.border, borderRadius: 14, color: C.text, fontWeight: 700, fontSize: 16, cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
          >
            Sign In →
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "0 48px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          {STATS.map(function(s) {
            return (
              <div key={s.label} style={{ textAlign: "center", background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "24px 16px" }}>
                <div style={{ fontSize: 32, fontWeight: 900, background: "linear-gradient(135deg,#3b82f6,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "40px 48px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Why HostelPro</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>Everything you need</div>
          <div style={{ fontSize: 16, color: C.muted, marginTop: 10 }}>Built specifically for Indian college students</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 960, margin: "0 auto" }}>
          {FEATURES.map(function(f) {
            return (
              <div key={f.title}
                style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "24px 22px", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; e.currentTarget.style.borderColor = C.accent + "50"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quotes ── */}
      <section style={{ padding: "40px 48px 60px", background: C.surface, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Our Promise</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>What we believe in</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 960, margin: "0 auto" }}>
          {QUOTES.map(function(q, i) {
            return (
              <div key={i} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ fontSize: 32, color: C.accent, fontWeight: 900, lineHeight: 1, marginBottom: 14 }}>"</div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 16 }}>{q.text}</div>
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>— {q.author}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "60px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Simple Process</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>How it works</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 960, margin: "0 auto" }}>
          {[
            { step: "01", icon: "📝", title: "Register",     desc: "Create your account with your student details" },
            { step: "02", icon: "🔍", title: "Search",       desc: "Find hostels by city or near your location" },
            { step: "03", icon: "📋", title: "Book",         desc: "Select dates and confirm your booking instantly" },
            { step: "04", icon: "🏠", title: "Move In",      desc: "Get your room and start your college journey" },
          ].map(function(s) {
            return (
              <div key={s.step} style={{ textAlign: "center", background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "28px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: "0.1em", marginBottom: 12 }}>{s.step}</div>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "60px 48px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1e3a6e,#1a2d5a)", border: "1px solid #3b82f630", borderRadius: 24, padding: "60px 40px", maxWidth: 700, margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "#3b82f615" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "#6366f115" }} />
          <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 14, letterSpacing: "-0.02em" }}>Ready to find your hostel?</div>
          <div style={{ fontSize: 16, color: C.muted, marginBottom: 30, lineHeight: 1.6 }}>
            Join thousands of students who found their perfect accommodation through HostelPro.
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              style={{ padding: "14px 32px", background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}
            >
              🎓 Register Now — It's Free
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{ padding: "14px 24px", background: "transparent", border: "1px solid #3b82f650", borderRadius: 14, color: C.text, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
            >
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid " + C.border, padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏨</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>HostelPro</span>
        </div>
        <div style={{ fontSize: 13, color: C.muted }}>© 2025 HostelPro. Built for Indian college students.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["About", "Privacy", "Terms", "Contact"].map(function(link) {
            return (
              <span key={link} style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}
                onMouseEnter={(e) => (e.target.style.color = C.accent)}
                onMouseLeave={(e) => (e.target.style.color = C.muted)}>
                {link}
              </span>
            );
          })}
        </div>
      </footer>

    </div>
  );
}