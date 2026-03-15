"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ClientLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"password" | "magic">("password");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (mode === "magic") {
            await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/client/dashboard` },
            });
            setSent(true);
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError("Invalid email or password."); setLoading(false); return; }
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
                width: "100%", maxWidth: 440,
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.8)",
            }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 36, fontWeight: 300, color: "#1d1d1f" }}>
                        Synve<span style={{ color: "#0071e3" }}>.</span>
                    </h1>
                    <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 26, fontWeight: 300, color: "#1d1d1f", marginTop: 16, marginBottom: 8 }}>
                        Client Portal
                    </h2>
                    <p style={{ fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)", lineHeight: 1.6 }}>
                        Sign in to view your project dashboard.
                    </p>
                </div>

                {/* Mode toggle */}
                <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 4 }}>
                    {[{ label: "Password", value: "password" }, { label: "Magic Link", value: "magic" }].map(m => (
                        <button key={m.value} onClick={() => { setMode(m.value as any); setSent(false); setError(""); }} style={{
                            flex: 1, padding: "10px", borderRadius: 10, border: "none",
                            fontFamily: "var(--font-outfit)", fontSize: 13, cursor: "pointer",
                            background: mode === m.value ? "#ffffff" : "transparent",
                            color: mode === m.value ? "#1d1d1f" : "#6e6e73",
                            boxShadow: mode === m.value ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                            transition: "all 0.2s",
                        }}>{m.label}</button>
                    ))}
                </div>

                {sent ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(52,199,89,0.08)", border: "1.5px solid rgba(52,199,89,0.2)", borderRadius: 20 }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 8 }}>Check your email!</h3>
                        <p style={{ fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)", lineHeight: 1.6 }}>
                            We sent a magic link to <strong>{email}</strong>. Click it to access your dashboard.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>Email Address</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                                style={{ padding: "14px 18px", borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.1)", fontSize: 15, fontFamily: "var(--font-outfit)", color: "#1d1d1f", background: "#f5f5f7", outline: "none" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"} />
                        </div>

                        {mode === "password" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>Password</label>
                                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                                    style={{ padding: "14px 18px", borderRadius: 12, border: "1.5px solid rgba(0,0,0,0.1)", fontSize: 15, fontFamily: "var(--font-outfit)", color: "#1d1d1f", background: "#f5f5f7", outline: "none" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"} />
                            </div>
                        )}

                        {error && <p style={{ fontSize: 13, color: "#ff3b30", fontFamily: "var(--font-outfit)", textAlign: "center" }}>{error}</p>}

                        <button type="submit" disabled={loading} style={{
                            fontSize: 15, background: "#0071e3", color: "white",
                            padding: "16px 40px", border: "none",
                            fontFamily: "var(--font-outfit)", fontWeight: 400,
                            borderRadius: 980, transition: "all 0.25s",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}>
                            {loading ? "Signing in..." : mode === "magic" ? "Send Magic Link →" : "Sign In →"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}