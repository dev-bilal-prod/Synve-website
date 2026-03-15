"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: scrolled ? "16px 80px" : "28px 80px",
            background: scrolled ? "rgba(245,245,247,0.85)" : "rgba(245,245,247,0.72)",
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

            {/* Links */}
            <ul style={{ display: "flex", gap: 48, listStyle: "none" }}>
                {[
                    { label: "About", href: "#about" },
                    { label: "Services", href: "#services" },
                    { label: "Process", href: "#process" },
                    { label: "Contact", href: "#contact" },
                ].map((link) => (
                    <li key={link.label}>
                        <Link href={link.href} style={{
                            fontSize: 13, letterSpacing: "0.02em",
                            color: "#6e6e73",
                            textDecoration: "none", fontFamily: "var(--font-outfit)",
                            fontWeight: 400, transition: "color 0.25s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1f")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#6e6e73")}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href="/client/login" style={{
                    fontSize: 13, letterSpacing: "0.01em",
                    color: "#0071e3",
                    background: "rgba(0,113,227,0.08)",
                    border: "1px solid rgba(0,113,227,0.2)",
                    padding: "10px 20px", textDecoration: "none",
                    fontFamily: "var(--font-outfit)", fontWeight: 400,
                    borderRadius: 980,
                    transition: "all 0.25s", display: "inline-block",
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,113,227,0.14)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,113,227,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                    Client Login
                </Link>

                <Link href="#contact" style={{
                    fontSize: 13, letterSpacing: "0.01em",
                    color: "white",
                    background: "#0071e3",
                    padding: "10px 24px", textDecoration: "none",
                    fontFamily: "var(--font-outfit)", fontWeight: 400,
                    borderRadius: 980,
                    transition: "all 0.25s", display: "inline-block",
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#0077ed"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                    Get a Quote
                </Link>
            </div>
        </nav>
    );
}