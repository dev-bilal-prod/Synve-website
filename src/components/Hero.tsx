"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: {
            x: number; y: number;
            vx: number; vy: number;
            size: number; opacity: number;
        }[] = [];

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.2 + 0.05,
            });
        }

        let animId: number;
        function animate() {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas!.width;
                if (p.x > canvas!.width) p.x = 0;
                if (p.y < 0) p.y = canvas!.height;
                if (p.y > canvas!.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,113,227,${p.opacity})`;
                ctx.fill();
            });
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach((b) => {
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(0,113,227,${0.05 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            animId = requestAnimationFrame(animate);
        }
        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section style={{
            position: "relative", minHeight: "100vh",
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            padding: "0 80px", overflow: "hidden",
            textAlign: "center",
            background: "linear-gradient(135deg, #d4e6ff 0%, #f0f0f5 40%, #f0d4ff 100%)",
        }}>

            {/* Canvas */}
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

            {/* Background blobs */}
            <div style={{
                position: "absolute", top: "-20%", left: "-10%",
                width: 600, height: 600, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 65%)",
                filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "absolute", bottom: "-20%", right: "-10%",
                width: 700, height: 700, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(180,0,255,0.1) 0%, transparent 65%)",
                filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "absolute", top: "30%", right: "10%",
                width: 400, height: 400, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 65%)",
                filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
            }} />

            {/* Card 1 — top left */}
            <div style={{
                position: "absolute", top: "12%", left: "5%",
                width: 240, height: 130,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                padding: "22px 28px",
                display: "flex", flexDirection: "column", gap: 8,
                animation: "float1 6s ease-in-out infinite",
                zIndex: 1,
            }}>
                <div style={{ fontSize: 12, color: "#6e6e73", letterSpacing: "0.05em", fontFamily: "var(--font-outfit)" }}>Active Projects</div>
                <div style={{ fontSize: 38, fontFamily: "var(--font-cormorant)", fontWeight: 300, color: "#1d1d1f" }}>12</div>
                <div style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)" }}>↑ 3 this month</div>
            </div>

            {/* Card 2 — top right */}
            <div style={{
                position: "absolute", top: "8%", right: "6%",
                width: 260, height: 140,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                padding: "22px 28px",
                display: "flex", flexDirection: "column", gap: 8,
                animation: "float2 7s ease-in-out infinite",
                zIndex: 1,
            }}>
                <div style={{ fontSize: 12, color: "#6e6e73", letterSpacing: "0.05em", fontFamily: "var(--font-outfit)" }}>Client Satisfaction</div>
                <div style={{ fontSize: 38, fontFamily: "var(--font-cormorant)", fontWeight: 300, color: "#1d1d1f" }}>98%</div>
                <div style={{ fontSize: 12, color: "#34c759", fontFamily: "var(--font-outfit)" }}>● All clients happy</div>
            </div>

            {/* Card 3 — bottom left */}
            <div style={{
                position: "absolute", bottom: "14%", left: "4%",
                width: 270, height: 130,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                padding: "22px 28px",
                display: "flex", flexDirection: "column", gap: 8,
                animation: "float3 8s ease-in-out infinite",
                zIndex: 1,
            }}>
                <div style={{ fontSize: 12, color: "#6e6e73", letterSpacing: "0.05em", fontFamily: "var(--font-outfit)" }}>Services</div>
                <div style={{ fontSize: 15, fontFamily: "var(--font-outfit)", fontWeight: 300, color: "#1d1d1f", lineHeight: 1.7 }}>
                    IoT · Web · Mobile<br />IT Managed Services
                </div>
            </div>

            {/* Card 4 — bottom right */}
            <div style={{
                position: "absolute", bottom: "16%", right: "5%",
                width: 240, height: 130,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                padding: "22px 28px",
                display: "flex", flexDirection: "column", gap: 8,
                animation: "float4 5.5s ease-in-out infinite",
                zIndex: 1,
            }}>
                <div style={{ fontSize: 12, color: "#6e6e73", letterSpacing: "0.05em", fontFamily: "var(--font-outfit)" }}>Response Time</div>
                <div style={{ fontSize: 38, fontFamily: "var(--font-cormorant)", fontWeight: 300, color: "#1d1d1f" }}>24h</div>
                <div style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)" }}>Guaranteed reply</div>
            </div>

            {/* Card 5 — middle left */}
            <div style={{
                position: "absolute", top: "45%", left: "2%",
                width: 220, height: 110,
                background: "rgba(0,113,227,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0,113,227,0.2)",
                borderRadius: 20,
                boxShadow: "0 8px 32px rgba(0,113,227,0.08)",
                padding: "18px 24px",
                display: "flex", flexDirection: "column", gap: 8,
                animation: "float2 9s ease-in-out infinite",
                zIndex: 1,
            }}>
                <div style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)" }}>Based in Pakistan</div>
                <div style={{ fontSize: 15, fontFamily: "var(--font-outfit)", color: "#1d1d1f" }}>🌍 Serving globally</div>
            </div>

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 860 }}>

                {/* Eyebrow chip */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(0,113,227,0.08)",
                    border: "1px solid rgba(0,113,227,0.15)",
                    borderRadius: 980, padding: "8px 20px",
                    marginBottom: 40,
                    animation: "fadeUp 0.8s 0.1s both",
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                    <span style={{ fontSize: 13, color: "var(--accent)", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>
                        Pakistan's Premium IT Company
                    </span>
                </div>

                {/* Heading */}
                <h1 style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(52px, 7vw, 108px)",
                    fontWeight: 300, lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                    animation: "fadeUp 0.9s 0.25s both",
                }}>
                    Engineering<br />
                    <em style={{
                        fontStyle: "italic",
                        background: "linear-gradient(135deg, #0071e3 0%, #00c6ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>Intelligent</em><br />
                    Solutions
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 18, lineHeight: 1.8,
                    color: "var(--text-secondary)", maxWidth: 560,
                    margin: "36px auto 0",
                    fontFamily: "var(--font-outfit)", fontWeight: 300,
                    animation: "fadeUp 0.9s 0.4s both",
                }}>
                    From embedded systems and IoT to web platforms and mobile apps —
                    Synve delivers complete technology solutions built for the real world.
                </p>

                {/* Buttons */}
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 16,
                    marginTop: 52, animation: "fadeUp 0.9s 0.55s both",
                }}>
                    <Link href="#services" style={{
                        fontSize: 15, background: "var(--accent)", color: "white",
                        padding: "16px 40px", textDecoration: "none",
                        fontFamily: "var(--font-outfit)", fontWeight: 400,
                        borderRadius: 980, transition: "all 0.25s", display: "inline-block",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        Explore Services
                    </Link>
                    <Link href="#contact" style={{
                        fontSize: 15, color: "var(--accent)",
                        padding: "16px 40px", textDecoration: "none",
                        fontFamily: "var(--font-outfit)", fontWeight: 400,
                        borderRadius: 980,
                        border: "1px solid rgba(0,113,227,0.3)",
                        transition: "all 0.25s", display: "inline-block",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,113,227,0.06)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        Start a Project →
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
                position: "absolute", bottom: 48, left: "50%",
                transform: "translateX(-50%)",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8,
                animation: "fadeUp 0.9s 0.8s both",
            }}>
                <div style={{
                    width: 1, height: 48,
                    background: "linear-gradient(180deg, transparent, var(--text-light))",
                    animation: "scrollPulse 2s ease infinite",
                }} />
                <span style={{
                    fontSize: 11, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "var(--text-light)",
                    fontFamily: "var(--font-outfit)",
                }}>Scroll</span>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-20px) rotate(-1deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0.5deg); }
          50% { transform: translateY(-12px) rotate(-0.5deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-18px) rotate(0.5deg); }
        }
      `}</style>
        </section>
    );
}