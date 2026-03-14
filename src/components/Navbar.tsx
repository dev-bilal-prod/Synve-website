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
                letterSpacing: "0.08em", color: "var(--text-primary)",
                textDecoration: "none",
            }}>
                Synve<span style={{ color: "var(--accent)" }}>.</span>
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
                            color: "var(--text-secondary)",
                            textDecoration: "none", fontFamily: "var(--font-outfit)",
                            fontWeight: 400, transition: "color 0.25s",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Link href="#contact" style={{
                fontSize: 13, letterSpacing: "0.01em",
                color: "white",
                background: "var(--accent)",
                padding: "10px 24px", textDecoration: "none",
                fontFamily: "var(--font-outfit)", fontWeight: 400,
                borderRadius: 980,
                transition: "all 0.25s", display: "inline-block",
            }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
                Get a Quote
            </Link>
        </nav>
    );
}