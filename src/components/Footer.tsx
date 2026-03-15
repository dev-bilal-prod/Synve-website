"use client";

export default function Footer() {
    return (
        <footer style={{
            padding: "40px clamp(24px, 5vw, 80px)",
            background: "#1d1d1f",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
            <a href="#" style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 400, letterSpacing: "0.08em", color: "#f5f5f7", textDecoration: "none" }}>
                Synve<span style={{ color: "#0071e3" }}>.</span>
            </a>
            <p style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
                © 2025 Synve. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 28 }}>
                {["Services", "Process", "Contact"].map((link) => (
                    <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: 13, color: "#6e6e73", textDecoration: "none", fontFamily: "var(--font-outfit)", transition: "color 0.25s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f5f5f7"}
                        onMouseLeave={e => e.currentTarget.style.color = "#6e6e73"}
                    >{link}</a>
                ))}
            </div>
        </footer>
    );
}