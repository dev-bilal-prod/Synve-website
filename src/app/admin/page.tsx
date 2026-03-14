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

type Client = {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
};

type Project = {
    id: string;
    client_id: string;
    title: string;
    type: string;
    status: string;
    progress: number;
    start_date: string;
    deadline: string;
    notes: string;
};

const statusColors: Record<string, string> = {
    new: "#0071e3",
    contacted: "#ff9500",
    won: "#34c759",
    lost: "#ff3b30",
};

const tabs = ["Leads", "Clients", "Projects"];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Leads");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddClient, setShowAddClient] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);

    // Forms
    const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", company: "" });
    const [projectForm, setProjectForm] = useState({ client_id: "", title: "", type: "web", status: "in_progress", progress: 0, start_date: "", deadline: "", notes: "" });

    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/admin/login"); return; }
        setUser(user);
        await Promise.all([fetchLeads(), fetchClients(), fetchProjects()]);
        setLoading(false);
    }

    async function fetchLeads() {
        const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        if (data) setLeads(data);
    }

    async function fetchClients() {
        const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
        if (data) setClients(data);
    }

    async function fetchProjects() {
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (data) setProjects(data);
    }

    async function updateLeadStatus(id: string, status: string) {
        await supabase.from("leads").update({ status }).eq("id", id);
        fetchLeads();
    }

    async function deleteLead(id: string) {
        if (!confirm("Delete this lead?")) return;
        await supabase.from("leads").delete().eq("id", id);
        fetchLeads();
    }

    async function deleteClient(id: string) {
        if (!confirm("Delete this client? This will also delete their projects.")) return;
        await supabase.from("clients").delete().eq("id", id);
        fetchClients();
    }

    async function deleteProject(id: string) {
        if (!confirm("Delete this project?")) return;
        await supabase.from("projects").delete().eq("id", id);
        fetchProjects();
    }

    async function addClient(e: React.FormEvent) {
        e.preventDefault();

        // Create auth user
        const { data, error } = await supabase.auth.admin.createUser({
            email: clientForm.email,
            password: Math.random().toString(36).slice(-10),
            email_confirm: true,
        });

        if (error) { alert("Error creating client: " + error.message); return; }

        // Add to clients table
        await supabase.from("clients").insert([{
            id: data.user.id,
            name: clientForm.name,
            email: clientForm.email,
            phone: clientForm.phone,
            company: clientForm.company,
        }]);

        setClientForm({ name: "", email: "", phone: "", company: "" });
        setShowAddClient(false);
        fetchClients();
    }

    async function addProject(e: React.FormEvent) {
        e.preventDefault();
        const { data } = await supabase.from("projects").insert([projectForm]).select().single();

        // Create type-specific details
        if (data) {
            if (projectForm.type === "web") await supabase.from("web_details").insert([{ project_id: data.id }]);
            if (projectForm.type === "iot") await supabase.from("iot_details").insert([{ project_id: data.id }]);
            if (projectForm.type === "mobile") await supabase.from("mobile_details").insert([{ project_id: data.id }]);
            if (projectForm.type === "managed") await supabase.from("managed_details").insert([{ project_id: data.id }]);
        }

        setProjectForm({ client_id: "", title: "", type: "web", status: "in_progress", progress: 0, start_date: "", deadline: "", notes: "" });
        setShowAddProject(false);
        fetchProjects();
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/admin/login");
    }

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f7" }}>
            <p style={{ fontFamily: "var(--font-outfit)", color: "#6e6e73" }}>Loading...</p>
        </div>
    );

    const inputStyle = {
        padding: "12px 16px", borderRadius: 10,
        border: "1.5px solid rgba(0,0,0,0.1)",
        fontSize: 14, fontFamily: "var(--font-outfit)",
        color: "#1d1d1f", background: "#f5f5f7",
        outline: "none", width: "100%",
    };

    const labelStyle = {
        fontSize: 12, color: "#6e6e73",
        fontFamily: "var(--font-outfit)",
        letterSpacing: "0.04em", marginBottom: 6,
        display: "block" as const,
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar */}
            <div style={{
                background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "20px 48px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
            }}>
                <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f" }}>
                    Synve<span style={{ color: "#0071e3" }}>.</span> Admin
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{user?.email}</span>
                    <button onClick={handleLogout} style={{
                        fontSize: 13, color: "#ff3b30", background: "rgba(255,59,48,0.08)",
                        border: "1px solid rgba(255,59,48,0.2)", padding: "8px 20px",
                        borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer",
                    }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: "40px 48px", maxWidth: 1300, margin: "0 auto" }}>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
                    {[
                        { label: "Total Leads", value: leads.length, color: "#0071e3" },
                        { label: "New Leads", value: leads.filter(l => l.status === "new").length, color: "#ff9500" },
                        { label: "Total Clients", value: clients.length, color: "#34c759" },
                        { label: "Active Projects", value: projects.filter(p => p.status === "in_progress").length, color: "#af52de" },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: "#ffffff", borderRadius: 16, padding: "28px 24px",
                            border: "1px solid rgba(0,0,0,0.06)",
                        }}>
                            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 42, fontWeight: 300, color: stat.color, lineHeight: 1 }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginTop: 8 }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#ffffff", borderRadius: 12, padding: 4, width: "fit-content", border: "1px solid rgba(0,0,0,0.06)" }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: "10px 24px", borderRadius: 10, border: "none",
                            fontFamily: "var(--font-outfit)", fontSize: 14, cursor: "pointer",
                            background: activeTab === tab ? "#0071e3" : "transparent",
                            color: activeTab === tab ? "white" : "#6e6e73",
                            transition: "all 0.2s",
                        }}>{tab}</button>
                    ))}
                </div>

                {/* LEADS TAB */}
                {activeTab === "Leads" && (
                    <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                        <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f" }}>All Leads</h2>
                            <span style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{leads.length} total</span>
                        </div>
                        {leads.length === 0 ? (
                            <div style={{ padding: "60px", textAlign: "center", color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>No leads yet.</div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f5f5f7" }}>
                                        {["Name", "Email", "Service", "Message", "Status", "Date", ""].map(h => (
                                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead, i) => (
                                        <tr key={lead.id} style={{ borderTop: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                                            <td style={{ padding: "14px 20px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{lead.name}</td>
                                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{lead.email}</td>
                                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{lead.service}</td>
                                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", maxWidth: 180 }}>{lead.message.slice(0, 50)}{lead.message.length > 50 ? "..." : ""}</td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)} style={{
                                                    fontSize: 12, padding: "6px 12px", borderRadius: 980,
                                                    border: `1.5px solid ${statusColors[lead.status]}44`,
                                                    background: `${statusColors[lead.status]}10`,
                                                    color: statusColors[lead.status],
                                                    fontFamily: "var(--font-outfit)", cursor: "pointer", outline: "none",
                                                }}>
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="won">Won</option>
                                                    <option value="lost">Lost</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: "14px 20px", fontSize: 12, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                                {new Date(lead.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <button onClick={() => deleteLead(lead.id)} style={{
                                                    fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)",
                                                    border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px",
                                                    borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer",
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* CLIENTS TAB */}
                {activeTab === "Clients" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                            <button onClick={() => setShowAddClient(true)} style={{
                                fontSize: 14, background: "#0071e3", color: "white",
                                padding: "12px 28px", border: "none", borderRadius: 980,
                                fontFamily: "var(--font-outfit)", cursor: "pointer",
                            }}>+ Add Client</button>
                        </div>
                        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f" }}>All Clients</h2>
                            </div>
                            {clients.length === 0 ? (
                                <div style={{ padding: "60px", textAlign: "center", color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>No clients yet. Add your first client!</div>
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f5f5f7" }}>
                                            {["Name", "Email", "Phone", "Company", ""].map(h => (
                                                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client, i) => (
                                            <tr key={client.id} style={{ borderTop: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                                                <td style={{ padding: "14px 20px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{client.name}</td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{client.email}</td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{client.phone || "—"}</td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{client.company || "—"}</td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <button onClick={() => deleteClient(client.id)} style={{
                                                        fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)",
                                                        border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px",
                                                        borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer",
                                                    }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === "Projects" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                            <button onClick={() => setShowAddProject(true)} style={{
                                fontSize: 14, background: "#0071e3", color: "white",
                                padding: "12px 28px", border: "none", borderRadius: 980,
                                fontFamily: "var(--font-outfit)", cursor: "pointer",
                            }}>+ Add Project</button>
                        </div>
                        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f" }}>All Projects</h2>
                            </div>
                            {projects.length === 0 ? (
                                <div style={{ padding: "60px", textAlign: "center", color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>No projects yet.</div>
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f5f5f7" }}>
                                            {["Title", "Type", "Client", "Progress", "Status", "Deadline", ""].map(h => (
                                                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project, i) => (
                                            <tr key={project.id} style={{ borderTop: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                                                <td style={{ padding: "14px 20px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{project.title}</td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{
                                                        fontSize: 12, padding: "4px 12px", borderRadius: 980,
                                                        background: project.type === "web" ? "rgba(0,113,227,0.1)" : project.type === "iot" ? "rgba(52,199,89,0.1)" : project.type === "mobile" ? "rgba(255,149,0,0.1)" : "rgba(175,82,222,0.1)",
                                                        color: project.type === "web" ? "#0071e3" : project.type === "iot" ? "#34c759" : project.type === "mobile" ? "#ff9500" : "#af52de",
                                                        fontFamily: "var(--font-outfit)",
                                                    }}>{project.type}</span>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                                                    {clients.find(c => c.id === project.client_id)?.name || "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px", minWidth: 120 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3 }}>
                                                            <div style={{ width: `${project.progress}%`, height: "100%", background: "#0071e3", borderRadius: 3 }} />
                                                        </div>
                                                        <span style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{project.progress}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{
                                                        fontSize: 12, padding: "4px 12px", borderRadius: 980,
                                                        background: project.status === "in_progress" ? "rgba(0,113,227,0.1)" : project.status === "completed" ? "rgba(52,199,89,0.1)" : project.status === "on_hold" ? "rgba(255,149,0,0.1)" : "rgba(255,59,48,0.1)",
                                                        color: project.status === "in_progress" ? "#0071e3" : project.status === "completed" ? "#34c759" : project.status === "on_hold" ? "#ff9500" : "#ff3b30",
                                                        fontFamily: "var(--font-outfit)",
                                                    }}>{project.status.replace("_", " ")}</span>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 12, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <button onClick={() => deleteProject(project.id)} style={{
                                                        fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)",
                                                        border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px",
                                                        borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer",
                                                    }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showAddClient && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
                }} onClick={() => setShowAddClient(false)}>
                    <div style={{
                        background: "#ffffff", borderRadius: 24, padding: "48px",
                        width: "100%", maxWidth: 480,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f", marginBottom: 32 }}>Add New Client</h2>
                        <form onSubmit={addClient} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div><label style={labelStyle}>Full Name</label><input required style={inputStyle} value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Client name" /></div>
                            <div><label style={labelStyle}>Email</label><input required type="email" style={inputStyle} value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} placeholder="client@email.com" /></div>
                            <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="+92 300 0000000" /></div>
                            <div><label style={labelStyle}>Company</label><input style={inputStyle} value={clientForm.company} onChange={e => setClientForm({ ...clientForm, company: e.target.value })} placeholder="Company name" /></div>
                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowAddClient(false)} style={{ flex: 1, padding: "14px", borderRadius: 980, border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "#6e6e73" }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: 980, border: "none", background: "#0071e3", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "white" }}>Add Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Project Modal */}
            {showAddProject && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
                }} onClick={() => setShowAddProject(false)}>
                    <div style={{
                        background: "#ffffff", borderRadius: 24, padding: "48px",
                        width: "100%", maxWidth: 520,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f", marginBottom: 32 }}>Add New Project</h2>
                        <form onSubmit={addProject} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Client</label>
                                <select required style={inputStyle} value={projectForm.client_id} onChange={e => setProjectForm({ ...projectForm, client_id: e.target.value })}>
                                    <option value="">Select a client</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div><label style={labelStyle}>Project Title</label><input required style={inputStyle} value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Smart Factory Dashboard" /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={labelStyle}>Type</label>
                                    <select style={inputStyle} value={projectForm.type} onChange={e => setProjectForm({ ...projectForm, type: e.target.value })}>
                                        <option value="web">Web</option>
                                        <option value="iot">IoT</option>
                                        <option value="mobile">Mobile</option>
                                        <option value="managed">Managed IT</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Progress (%)</label>
                                    <input type="number" min="0" max="100" style={inputStyle} value={projectForm.progress} onChange={e => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div><label style={labelStyle}>Start Date</label><input type="date" style={inputStyle} value={projectForm.start_date} onChange={e => setProjectForm({ ...projectForm, start_date: e.target.value })} /></div>
                                <div><label style={labelStyle}>Deadline</label><input type="date" style={inputStyle} value={projectForm.deadline} onChange={e => setProjectForm({ ...projectForm, deadline: e.target.value })} /></div>
                            </div>
                            <div><label style={labelStyle}>Notes</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={projectForm.notes} onChange={e => setProjectForm({ ...projectForm, notes: e.target.value })} placeholder="Any notes about this project..." /></div>
                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowAddProject(false)} style={{ flex: 1, padding: "14px", borderRadius: 980, border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "#6e6e73" }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: 980, border: "none", background: "#0071e3", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "white" }}>Add Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}