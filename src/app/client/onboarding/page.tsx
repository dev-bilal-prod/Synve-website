"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Onboarding() {
    const [form, setForm] = useState({ name: "", phone: "", company: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/client/login"); return; }

        await supabase.from("clients").update({
            name: form.name,
            phone: form.phone,
            company: form.company,
        }).eq("id", user.id);

        router.push("/client/dashboard");
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #d4e6ff 0%, #f0f0f5 40%, #f0d4ff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px 20px",
        }}>
            <div style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                borderRadius: 28, padding: "52px 48px",
                width: "100%", maxWidth: 480,
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.8)",
            }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 36, fontWeight: 300, color: "#1d1d1f" }}>
                        Synve<span style={{ color: "#0071e3" }}>.</span>
                    </h1>
                    <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 26, fontWeight: 300, color: "#1d1d1f", marginTop: 16, marginBottom: 8 }}>
                        Welcome aboard!
                    </h2>
                    <p style={{ fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)", lineHeight: 1.6 }}>
                        Let's set up your profile so we can personalize your experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                            Full Name *
                        </label>
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Your full name"
                            style={{
                                padding: "14px 18px", borderRadius: 12,
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                fontSize: 15, fontFamily: "var(--font-outfit)",
                                color: "#1d1d1f", background: "#f5f5f7", outline: "none",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                            WhatsApp Number *
                        </label>
                        <input
                            required
                            value={form.phone}
                            onChange={e => {
                                const val = e.target.value.replace(/[^\d+\s-]/g, "");
                                if (val.length <= 16) setForm({ ...form, phone: val });
                            }}
                            placeholder="+1 234 567 8900"
                            maxLength={16}
                            style={{
                                padding: "14px 18px", borderRadius: 12,
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                fontSize: 15, fontFamily: "var(--font-outfit)",
                                color: "#1d1d1f", background: "#f5f5f7", outline: "none",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                        />
                        <p style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                            Include country code e.g. +92 300 1234567 or +1 234 567 8900
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
                            Company / Business Name
                        </label>
                        <input
                            value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                            placeholder="Your company name (optional)"
                            style={{
                                padding: "14px 18px", borderRadius: 12,
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                fontSize: 15, fontFamily: "var(--font-outfit)",
                                color: "#1d1d1f", background: "#f5f5f7", outline: "none",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || form.phone.length < 8}
                        style={{
                            fontSize: 15, background: "#0071e3", color: "white",
                            padding: "16px 40px", border: "none",
                            fontFamily: "var(--font-outfit)", fontWeight: 400,
                            borderRadius: 980, transition: "all 0.25s",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: 8,
                            opacity: loading || form.phone.length < 8 ? 0.6 : 1,
                        }}
                    >
                        {loading ? "Setting up..." : "Go to My Dashboard →"}
                    </button>
                </form>
            </div>
        </div>
    );
}