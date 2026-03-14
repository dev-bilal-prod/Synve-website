"use client";

import { useState } from "react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
    const [sent, setSent] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSent(true);
        setForm({ name: "", email: "", service: "", message: "" });
    }

    return (
        <section id="contact" style={{
            padding: "140px 80px",
            background: "#f5f5f7",
        }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 60 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(0,113,227,0.06)",
                        border: "1px solid rgba(0,113,227,0.12)",
                        borderRadius: 980, padding: "7px 18px", marginBottom: 24,
                    }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }} />
                        <span style={{ fontSize: 12, color: "#0071e3", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>
                            Get in Touch
                        </span>
                    </div>

                    <h2 style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(36px, 5vw, 64px)",
                        fontWeight: 300, lineHeight: 1.05,
                        color: "#1d1d1f", marginBottom: 16,
                    }}>
                        Let's build something<br />
                        <em style={{
                            fontStyle: "italic",
                            background: "linear-gradient(135deg, #0071e3, #00c6ff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>great together.</em>
                    </h2>

                    <p style={{
                        fontSize: 16, color: "#6e6e73",
                        fontFamily: "var(--font-outfit)", fontWeight: 300,
                        lineHeight: 1.8,
                    }}>
                        Tell us about your project. We reply within 24 hours.
                    </p>
                </div>

                {/* Form */}
                {sent ? (
                    <div style={{
                        textAlign: "center", padding: "60px 40px",
                        background: "rgba(52,199,89,0.08)",
                        border: "1.5px solid rgba(52,199,89,0.2)",
                        borderRadius: 24,
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <h3 style={{
                            fontFamily: "var(--font-cormorant)",
                            fontSize: 32, fontWeight: 300, color: "#1d1d1f", marginBottom: 12,
                        }}>Message sent!</h3>
                        <p style={{ fontSize: 15, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
                            We will get back to you within 24 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{
                        background: "#ffffff",
                        borderRadius: 24, padding: "52px 48px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                        display: "flex", flexDirection: "column", gap: 24,
                    }}>

                        {/* Name + Email */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                                    Full Name
                                </label>
                                <input
                                    type="text" required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    style={{
                                        padding: "14px 18px", borderRadius: 12,
                                        border: "1.5px solid rgba(0,0,0,0.1)",
                                        fontSize: 15, fontFamily: "var(--font-outfit)", fontWeight: 300,
                                        color: "#1d1d1f", background: "#f5f5f7",
                                        outline: "none", transition: "border-color 0.25s",
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                                    Email Address
                                </label>
                                <input
                                    type="email" required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@company.com"
                                    style={{
                                        padding: "14px 18px", borderRadius: 12,
                                        border: "1.5px solid rgba(0,0,0,0.1)",
                                        fontSize: 15, fontFamily: "var(--font-outfit)", fontWeight: 300,
                                        color: "#1d1d1f", background: "#f5f5f7",
                                        outline: "none", transition: "border-color 0.25s",
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                                />
                            </div>
                        </div>

                        {/* Service */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                                Service Interested In
                            </label>
                            <select
                                required
                                value={form.service}
                                onChange={e => setForm({ ...form, service: e.target.value })}
                                style={{
                                    padding: "14px 18px", borderRadius: 12,
                                    border: "1.5px solid rgba(0,0,0,0.1)",
                                    fontSize: 15, fontFamily: "var(--font-outfit)", fontWeight: 300,
                                    color: form.service ? "#1d1d1f" : "#a1a1a6",
                                    background: "#f5f5f7", outline: "none",
                                    transition: "border-color 0.25s", appearance: "none",
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                            >
                                <option value="" disabled>Select a service</option>
                                <option value="iot">IoT & Embedded Systems</option>
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile App</option>
                                <option value="managed">IT Managed Services</option>
                                <option value="multiple">Multiple / Not Sure</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                                Tell Us About Your Project
                            </label>
                            <textarea
                                required
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="Briefly describe what you need..."
                                rows={5}
                                style={{
                                    padding: "14px 18px", borderRadius: 12,
                                    border: "1.5px solid rgba(0,0,0,0.1)",
                                    fontSize: 15, fontFamily: "var(--font-outfit)", fontWeight: 300,
                                    color: "#1d1d1f", background: "#f5f5f7",
                                    outline: "none", resize: "vertical",
                                    transition: "border-color 0.25s",
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" style={{
                            fontSize: 15, background: "#0071e3", color: "white",
                            padding: "16px 40px", border: "none",
                            fontFamily: "var(--font-outfit)", fontWeight: 400,
                            borderRadius: 980, transition: "all 0.25s",
                            alignSelf: "center", cursor: "pointer",
                            marginTop: 8,
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#0077ed"; e.currentTarget.style.transform = "scale(1.03)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.transform = "scale(1)"; }}
                        >
                            Send Message →
                        </button>
                    </form>
                )}

                {/* Contact details */}
                <div style={{
                    display: "flex", justifyContent: "center", gap: 48,
                    marginTop: 48,
                }}>
                    {[
                        { label: "Email", value: "hello@synve.pk" },
                        { label: "WhatsApp", value: "+92 300 0000000" },
                        { label: "Hours", value: "Mon–Sat, 9am–7pm PKT" },
                    ].map((item) => (
                        <div key={item.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#0071e3", fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}