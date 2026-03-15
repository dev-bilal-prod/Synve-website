"use client";

import { useEffect, useRef } from "react";

const steps = [
    { number: "01", title: "Discovery Call", description: "We start by listening. A focused conversation to understand your business, your problem, and what success looks like — before anything else.", icon: "🎯", color: "rgba(0,113,227,0.08)", accent: "#0071e3", duration: "30 mins" },
    { number: "02", title: "Proposal & Scope", description: "A clear written proposal with fixed pricing, timeline, and deliverables. No vague estimates, no hidden costs. You know exactly what you are getting.", icon: "📋", color: "rgba(52,199,89,0.08)", accent: "#34c759", duration: "24–48 hrs" },
    { number: "03", title: "Build & Iterate", description: "We build in milestones, sharing progress at every stage. You review, give feedback, and we refine — keeping you in the loop without overwhelming you.", icon: "⚙️", color: "rgba(255,149,0,0.08)", accent: "#ff9500", duration: "Project based" },
    { number: "04", title: "Deliver & Support", description: "Clean handover with full documentation. We don't disappear after delivery — ongoing support and maintenance available on monthly retainer.", icon: "🚀", color: "rgba(175,82,222,0.08)", accent: "#af52de", duration: "Ongoing" },
];

export default function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = sectionRef.current?.querySelectorAll(".process-item");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = el.dataset.delay || "0";
                        setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateX(0)"; }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        items?.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="process" ref={sectionRef} style={{ padding: "100px clamp(24px, 5vw, 80px)", background: "linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.12)", borderRadius: 980, padding: "7px 18px", marginBottom: 24 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }} />
                        <span style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)", fontWeight: 400, letterSpacing: "0.04em" }}>How We Work</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, lineHeight: 1.05, color: "#1d1d1f", marginBottom: 20 }}>
                        A process that<br />
                        <em style={{ fontStyle: "italic", background: "linear-gradient(135deg, #0071e3, #00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>respects your time.</em>
                    </h2>
                    <p style={{ fontSize: 17, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
                        No chaos, no surprises. Every project follows a clear structure that keeps you informed at every step.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {steps.map((step, i) => (
                        <div key={step.number} className="process-item" data-delay={String(i * 120)}
                            style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 24, alignItems: "center", background: "#ffffff", borderRadius: 24, padding: "28px clamp(20px, 4vw, 44px)", border: `1.5px solid ${step.accent}22`, opacity: 0, transform: "translateX(-32px)", transition: "opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease, border-color 0.3s ease", boxShadow: `0 2px 16px ${step.accent}10` }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px ${step.accent}22`; e.currentTarget.style.borderColor = `${step.accent}55`; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 2px 16px ${step.accent}10`; e.currentTarget.style.borderColor = `${step.accent}22`; }}
                        >
                            <div style={{ width: 72, height: 72, borderRadius: 20, background: step.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1.5px solid ${step.accent}33` }}>
                                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: step.accent }}>{step.number}</span>
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <span style={{ fontSize: 20 }}>{step.icon}</span>
                                    <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 400, color: "#1d1d1f", lineHeight: 1 }}>{step.title}</h3>
                                </div>
                                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300, maxWidth: 560 }}>{step.description}</p>
                            </div>
                            <div className="duration-badge" style={{ flexShrink: 0, background: step.color, border: `1.5px solid ${step.accent}44`, borderRadius: 980, padding: "10px 22px", whiteSpace: "nowrap" }}>
                                <span style={{ fontSize: 13, color: step.accent, fontFamily: "var(--font-outfit)", fontWeight: 400 }}>⏱ {step.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: 80, padding: "clamp(32px, 5vw, 64px) 40px", background: "linear-gradient(135deg, rgba(0,113,227,0.07), rgba(0,198,255,0.07))", borderRadius: 28, border: "1.5px solid rgba(0,113,227,0.14)" }}>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#1d1d1f", marginBottom: 14 }}>Ready to get started?</p>
                    <p style={{ fontSize: 16, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300, marginBottom: 36, lineHeight: 1.8 }}>The first conversation is always free and always honest.</p>
                    <a href="#contact" style={{ fontSize: 15, background: "#0071e3", color: "white", padding: "16px 44px", textDecoration: "none", fontFamily: "var(--font-outfit)", fontWeight: 400, borderRadius: 980, transition: "all 0.25s", display: "inline-block" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#0077ed"; e.currentTarget.style.transform = "scale(1.03)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.transform = "scale(1)"; }}
                    >Start the Conversation →</a>
                </div>
            </div>

            <style>{`
        @media (max-width: 600px) {
          .process-item { grid-template-columns: 56px 1fr !important; }
          .duration-badge { display: none !important; }
        }
      `}</style>
        </section>
    );
}