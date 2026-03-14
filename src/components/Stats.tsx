"use client";

import { useEffect, useRef } from "react";

const stats = [
    { value: "5+", label: "Industries Served", accent: "#0071e3" },
    { value: "24h", label: "Response Guarantee", accent: "#34c759" },
    { value: "IoT · Web · Mobile", label: "Complete Stack", accent: "#ff9500" },
    { value: "PK & Global", label: "Client Reach", accent: "#af52de" },
];

export default function Stats() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = sectionRef.current?.querySelectorAll(".stat-item");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = el.dataset.delay || "0";
                        setTimeout(() => {
                            el.style.opacity = "1";
                            el.style.transform = "translateY(0)";
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        items?.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} style={{
            padding: "100px 80px",
            background: "#1d1d1f",
            position: "relative",
            overflow: "hidden",
        }}>

            {/* Background glow */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800, height: 400, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,113,227,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                maxWidth: 1100, margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
            }}>
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className="stat-item"
                        data-delay={String(i * 100)}
                        style={{
                            padding: "48px 40px",
                            textAlign: "center",
                            borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                            opacity: 0,
                            transform: "translateY(20px)",
                            transition: "opacity 0.6s ease, transform 0.6s ease",
                            cursor: "default",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${stat.accent}08`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <div style={{
                            fontFamily: "var(--font-cormorant)",
                            fontSize: "clamp(32px, 3.5vw, 52px)",
                            fontWeight: 300, lineHeight: 1,
                            color: stat.accent,
                            marginBottom: 12,
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: 13, color: "#6e6e73",
                            fontFamily: "var(--font-outfit)", fontWeight: 300,
                            letterSpacing: "0.04em",
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}