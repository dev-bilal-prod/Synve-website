"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Invalid email or password.");
            setLoading(false);
            return;
        }

        router.push("/admin");
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f5f5f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: "52px 48px",
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: 36, fontWeight: 300,
                        color: "#1d1d1f",
                    }}>
                        Synve<span style={{ color: "#0071e3" }}>.</span>
                    </h1>
                    <p style={{
                        fontSize: 13, color: "#6e6e73",
                        fontFamily: "var(--font-outfit)",
                        marginTop: 8,
                    }}>
                        Admin Dashboard
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} style={{
                    display: "flex", flexDirection: "column", gap: 20,
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{
                            fontSize: 12, color: "#6e6e73",
                            fontFamily: "var(--font-outfit)",
                            letterSpacing: "0.04em",
                        }}>
                            Email
                        </label>
                        <input
                            type="email" required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={{
                                padding: "14px 18px", borderRadius: 12,
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                fontSize: 15, fontFamily: "var(--font-outfit)",
                                color: "#1d1d1f", background: "#f5f5f7",
                                outline: "none",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{
                            fontSize: 12, color: "#6e6e73",
                            fontFamily: "var(--font-outfit)",
                            letterSpacing: "0.04em",
                        }}>
                            Password
                        </label>
                        <input
                            type="password" required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                padding: "14px 18px", borderRadius: 12,
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                fontSize: 15, fontFamily: "var(--font-outfit)",
                                color: "#1d1d1f", background: "#f5f5f7",
                                outline: "none",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                        />
                    </div>

                    {error && (
                        <p style={{
                            fontSize: 13, color: "#ff3b30",
                            fontFamily: "var(--font-outfit)",
                            textAlign: "center",
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            fontSize: 15, background: "#0071e3", color: "white",
                            padding: "16px 40px", border: "none",
                            fontFamily: "var(--font-outfit)", fontWeight: 400,
                            borderRadius: 980, transition: "all 0.25s",
                            cursor: "pointer", marginTop: 8,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </button>
                </form>
            </div>
        </div>
    );
}