"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Lead = {
    id: string;
    name: string;
    email: string;
    service: string;
    message: string;
    status: string;
    created_at: string;
};

const statusColors: Record<string, string> = {
    new: "#0071e3",
    contacted: "#ff9500",
    won: "#34c759",
    lost: "#ff3b30",
};

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        checkUser();
        fetchLeads();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/admin/login");
            return;
        }
        setUser(user);
    }

    async function fetchLeads() {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setLeads(data);
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        await supabase.from("leads").update({ status }).eq("id", id);
        fetchLeads();
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/admin/login");
    }

    if (loading) return (
        <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#f5f5f7",
        }}>
            <p style={{ fontFamily: "var(--font-outfit)", color: "#6e6e73" }}>Loading...</p>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Top navbar */}
            <div style={{
                background: "#ffffff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "20px 48px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
            }}>
                <h1 style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: 28, fontWeight: 300, color: "#1d1d1f",
                }}>
                    Synve<span style={{ color: "#0071e3" }}>.</span> Admin
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                        {user?.email}
                    </span>
                    <button onClick={handleLogout} style={{
                        fontSize: 13, color: "#ff3b30",
                        background: "rgba(255,59,48,0.08)",
                        border: "1px solid rgba(255,59,48,0.2)",
                        padding: "8px 20px", borderRadius: 980,
                        fontFamily: "var(--font-outfit)", cursor: "pointer",
                    }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "48px", maxWidth: 1200, margin: "0 auto" }}>

                {/* Stats row */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16, marginBottom: 40,
                }}>
                    {[
                        { label: "Total Leads", value: leads.length, color: "#0071e3" },
                        { label: "New", value: leads.filter(l => l.status === "new").length, color: "#0071e3" },
                        { label: "Won", value: leads.filter(l => l.status === "won").length, color: "#34c759" },
                        { label: "Lost", value: leads.filter(l => l.status === "lost").length, color: "#ff3b30" },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: "#ffffff", borderRadius: 16,
                            padding: "28px 24px",
                            border: "1px solid rgba(0,0,0,0.06)",
                        }}>
                            <div style={{
                                fontFamily: "var(--font-cormorant)",
                                fontSize: 42, fontWeight: 300,
                                color: stat.color, lineHeight: 1,
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: 13, color: "#6e6e73",
                                fontFamily: "var(--font-outfit)", marginTop: 8,
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Leads table */}
                <div style={{
                    background: "#ffffff", borderRadius: 20,
                    border: "1px solid rgba(0,0,0,0.06)",
                    overflow: "hidden",
                }}>
                    <div style={{
                        padding: "24px 32px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <h2 style={{
                            fontFamily: "var(--font-cormorant)",
                            fontSize: 24, fontWeight: 300, color: "#1d1d1f",
                        }}>
                            All Leads
                        </h2>
                        <span style={{
                            fontSize: 12, color: "#6e6e73",
                            fontFamily: "var(--font-outfit)",
                        }}>
                            {leads.length} total
                        </span>
                    </div>

                    {leads.length === 0 ? (
                        <div style={{
                            padding: "60px", textAlign: "center",
                            color: "#6e6e73", fontFamily: "var(--font-outfit)",
                        }}>
                            No leads yet. Share your website to get started!
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f5f5f7" }}>
                                    {["Name", "Email", "Service", "Message", "Status", "Date"].map(h => (
                                        <th key={h} style={{
                                            padding: "12px 24px", textAlign: "left",
                                            fontSize: 11, color: "#6e6e73",
                                            fontFamily: "var(--font-outfit)",
                                            letterSpacing: "0.08em", textTransform: "uppercase",
                                            fontWeight: 400,
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, i) => (
                                    <tr key={lead.id} style={{
                                        borderTop: "1px solid rgba(0,0,0,0.04)",
                                        background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                                    }}>
                                        <td style={{ padding: "16px 24px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>
                                            {lead.name}
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                                            {lead.email}
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                                            {lead.service}
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", maxWidth: 200 }}>
                                            {lead.message.slice(0, 60)}{lead.message.length > 60 ? "..." : ""}
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <select
                                                value={lead.status}
                                                onChange={e => updateStatus(lead.id, e.target.value)}
                                                style={{
                                                    fontSize: 12, padding: "6px 12px",
                                                    borderRadius: 980, border: `1.5px solid ${statusColors[lead.status]}44`,
                                                    background: `${statusColors[lead.status]}10`,
                                                    color: statusColors[lead.status],
                                                    fontFamily: "var(--font-outfit)",
                                                    cursor: "pointer", outline: "none",
                                                }}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="won">Won</option>
                                                <option value="lost">Lost</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: 12, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                            {new Date(lead.created_at).toLocaleDateString("en-PK", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}