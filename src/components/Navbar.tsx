"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: scrolled ? "16px 40px" : "28px 40px",
                background: scrolled || menuOpen ? "rgba(245,245,247,0.95)" : "rgba(245,245,247,0.72)",
                backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.08)" : "transparent"}`,
                transition: "all 0.4s ease",
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: 28, fontWeight: 400,
                    letterSpacing: "0.08em", color: "#1d1d1f",
                    textDecoration: "none",
                }}>
                    Synve<span style={{ color: "#0071e3" }}>.</span>
                </Link>

                {/* Desktop Links */}
                <ul style={{ display: "flex", gap: 48, listStyle: "none", margin: 0 }} className="desktop-nav">
                    {[
                        { label: "About", href: "#about" },
                        { label: "Services", href: "#services" },
                        { label: "Process", href: "#process" },
                        { label: "Contact", href: "#contact" },
                    ].map((link) => (
                        <li key={link.label}>
                            <Link href={link.href} style={{
                                fontSize: 13, letterSpacing: "0.02em",
                                color: "#6e6e73", textDecoration: "none",
                                fontFamily: "var(--font-outfit)", fontWeight: 400,
                                transition: "color 0.25s",
                            }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1f")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#6e6e73")}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="desktop-nav">
                    <Link href="/client/login" style={{
                        fontSize: 13, color: "#0071e3",
                        background: "rgba(0,113,227,0.08)",
                        border: "1px solid rgba(0,113,227,0.2)",
                        padding: "10px 20px", textDecoration: "none",
                        fontFamily: "var(--font-outfit)", fontWeight: 400,
                        borderRadius: 980, transition: "all 0.25s", display: "inline-block",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,113,227,0.14)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,113,227,0.08)"; }}
                    >
                        Client Login
                    </Link>
                    <Link href="#contact" style={{
                        fontSize: 13, color: "white",
                        background: "#0071e3", padding: "10px 24px",
                        textDecoration: "none", fontFamily: "var(--font-outfit)",
                        fontWeight: 400, borderRadius: 980,
                        transition: "all 0.25s", display: "inline-block",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#0077ed"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#0071e3"; }}
                    >
                        Get a Quote
                    </Link>
                </div>

                {/* Hamburger — mobile only */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="mobile-menu-btn"
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "none", flexDirection: "column", gap: 5, padding: 8,
                    }}
                >
                    <span style={{ width: 24, height: 2, background: "#1d1d1f", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
                    <span style={{ width: 24, height: 2, background: "#1d1d1f", display: "block", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
                    <span style={{ width: 24, height: 2, background: "#1d1d1f", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(245,245,247,0.98)",
                    backdropFilter: "blur(20px)",
                    zIndex: 40, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 32,
                }}>
                    {[
                        { label: "About", href: "#about" },
                        { label: "Services", href: "#services" },
                        { label: "Process", href: "#process" },
                        { label: "Contact", href: "#contact" },
                    ].map((link) => (
                        <Link key={link.label} href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                fontFamily: "var(--font-cormorant)",
                                fontSize: 40, fontWeight: 300,
                                color: "#1d1d1f", textDecoration: "none",
                                letterSpacing: "0.02em",
                            }}>
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 16 }}>
                        <Link href="/client/login" onClick={() => setMenuOpen(false)} style={{
                            fontSize: 14, color: "#0071e3",
                            background: "rgba(0,113,227,0.08)",
                            border: "1px solid rgba(0,113,227,0.2)",
                            padding: "12px 32px", textDecoration: "none",
                            fontFamily: "var(--font-outfit)", borderRadius: 980,
                        }}>Client Login</Link>
                        <Link href="#contact" onClick={() => setMenuOpen(false)} style={{
                            fontSize: 14, color: "white",
                            background: "#0071e3", padding: "12px 32px",
                            textDecoration: "none", fontFamily: "var(--font-outfit)",
                            borderRadius: 980,
                        }}>Get a Quote</Link>
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </>
    );
}