"use client";

import { useEffect, useRef } from "react";

const services = [
    {
        number: "01",
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="6" y="6" width="12" height="12" rx="1" /><rect x="30" y="6" width="12" height="12" rx="1" />
                <rect x="6" y="30" width="12" height="12" rx="1" /><rect x="30" y="30" width="12" height="12" rx="1" />
                <line x1="18" y1="12" x2="30" y2="12" /><line x1="18" y1="36" x2="30" y2="36" />
                <line x1="12" y1="18" x2="12" y2="30" /><line x1="36" y1="18" x2="36" y2="30" />
                <circle cx="24" cy="24" r="4" />
            </svg>
        ),
        title: "IoT & Embedded Systems",
        description: "Custom firmware, microcontroller programming, sensor integration, and full IoT solutions with web dashboards. From concept to deployment — hardware and software, unified.",
        tags: ["ESP32 / STM32", "MQTT / Modbus", "IoT Dashboards", "Industrial Automation"],
        color: "rgba(0,113,227,0.1)",
        accent: "#0071e3",
    },
    {
        number: "02",
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="4" y="8" width="40" height="32" rx="2" />
                <line x1="4" y1="18" x2="44" y2="18" />
                <circle cx="10" cy="13" r="2" /><circle cx="17" cy="13" r="2" /><circle cx="24" cy="13" r="2" />
                <rect x="10" y="24" width="28" height="2" rx="1" /><rect x="10" y="30" width="20" height="2" rx="1" />
            </svg>
        ),
        title: "Web Development",
        description: "Premium websites, custom web applications, e-commerce platforms, and enterprise portals. Built with modern stacks, optimised for performance and growth.",
        tags: ["React / Next.js", "Node.js", "E-Commerce", "CMS & Portals"],
        color: "rgba(52,199,89,0.1)",
        accent: "#34c759",
    },
    {
        number: "03",
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="14" y="4" width="20" height="40" rx="3" />
                <line x1="14" y1="12" x2="34" y2="12" /><line x1="14" y1="36" x2="34" y2="36" />
                <circle cx="24" cy="41" r="2" />
            </svg>
        ),
        title: "Mobile Apps",
        description: "Cross-platform mobile applications for iOS and Android. Clean UI, fast performance, and seamless integration with backends and IoT hardware.",
        tags: ["React Native", "Flutter", "iOS & Android", "API Integration"],
        color: "rgba(255,149,0,0.1)",
        accent: "#ff9500",
    },
    {
        number: "04",
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="6" y="10" width="36" height="24" rx="2" />
                <line x1="16" y1="38" x2="32" y2="38" /><line x1="24" y1="34" x2="24" y2="38" />
                <circle cx="18" cy="22" r="4" />
                <line x1="26" y1="19" x2="36" y2="19" /><line x1="26" y1="25" x2="33" y2="25" />
            </svg>
        ),
        title: "IT Managed Services",
        description: "Monthly retainer-based IT support, system maintenance, cloud setup, and infrastructure management. Predictable costs, zero surprises.",
        tags: ["Cloud (AWS / Azure)", "Monthly Retainer", "Maintenance", "Networking"],
        color: "rgba(175,82,222,0.1)",
        accent: "#af52de",
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = sectionRef.current?.querySelectorAll(".service-card");
        cards?.forEach((card) => {
            (card as HTMLElement).style.opacity = "0";
            (card as HTMLElement).style.transform = "translateY(32px)";
        });
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
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );
        setTimeout(() => { cards?.forEach((card) => observer.observe(card)); }, 100);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="services" ref={sectionRef} style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "#ffffff" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.12)", borderRadius: 980, padding: "7px 18px", marginBottom: 24 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }} />
                    <span style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)", fontWeight: 400, letterSpacing: "0.04em" }}>What We Do</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, lineHeight: 1.05, color: "#1d1d1f", marginBottom: 20 }}>
                    Services built for<br />
                    <em style={{ fontStyle: "italic", background: "linear-gradient(135deg, #0071e3, #00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>complex problems.</em>
                </h2>
                <p style={{ fontSize: 17, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300, lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
                    We don't just build software. We solve real business problems with technology that actually works.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
                {services.map((service, i) => (
                    <div key={service.number} className="service-card" data-delay={String(i * 120)}
                        style={{ background: service.color, borderRadius: 24, padding: "48px 44px", border: `1px solid ${service.accent}22`, opacity: 0, transform: "translateY(32px)", transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s, box-shadow 0.3s ease, background 0.3s ease`, cursor: "default" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${service.accent}22`; e.currentTarget.style.background = service.color.replace("0.1", "0.18"); e.currentTarget.style.transform = "translateY(-4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = service.color; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", color: service.accent, border: `1.5px solid ${service.accent}33`, boxShadow: `0 4px 16px ${service.accent}22` }}>
                                <div style={{ color: service.accent }}>{service.icon}</div>
                            </div>
                            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 52, fontWeight: 300, color: `${service.accent}22`, lineHeight: 1 }}>{service.number}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 30, fontWeight: 400, color: "#1d1d1f", marginBottom: 16, lineHeight: 1.2 }}>{service.title}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#6e6e73", marginBottom: 28, fontFamily: "var(--font-outfit)", fontWeight: 300 }}>{service.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {service.tags.map((tag) => (
                                <span key={tag} style={{ fontSize: 12, color: service.accent, background: "rgba(255,255,255,0.7)", border: `1px solid ${service.accent}33`, borderRadius: 980, padding: "5px 14px", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}