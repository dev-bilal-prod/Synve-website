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

type Invoice = {
    id: string;
    project_id: string;
    client_id: string;
    amount: number;
    currency: string;
    status: string;
    due_date: string;
    paid_date: string;
    description: string;
    created_at: string;
};

const statusColors: Record<string, string> = {
    new: "#0071e3",
    contacted: "#ff9500",
    won: "#34c759",
    lost: "#ff3b30",
};

const tabs = ["Leads", "Clients", "Projects", "Invoices"];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Leads");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [showAddClient, setShowAddClient] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddInvoice, setShowAddInvoice] = useState(false);

    const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", company: "" });
    const [projectForm, setProjectForm] = useState({ client_id: "", title: "", type: "web", status: "in_progress", progress: 0, start_date: "", deadline: "", notes: "" });
    const [invoiceForm, setInvoiceForm] = useState({ project_id: "", client_id: "", amount: 0, currency: "PKR", due_date: "", description: "" });

    const router = useRouter();

    useEffect(() => { checkUser(); }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/admin/login"); return; }
        setUser(user);
        await Promise.all([fetchLeads(), fetchClients(), fetchProjects(), fetchInvoices()]);
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

    async function fetchInvoices() {
        const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
        if (data) setInvoices(data);
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
        if (!confirm("Delete this client?")) return;
        await supabase.from("clients").delete().eq("id", id);
        fetchClients();
    }

    async function deleteProject(id: string) {
        if (!confirm("Delete this project?")) return;
        await supabase.from("projects").delete().eq("id", id);
        fetchProjects();
    }

    async function deleteInvoice(id: string) {
        if (!confirm("Delete this invoice?")) return;
        await supabase.from("invoices").delete().eq("id", id);
        fetchInvoices();
    }

    async function addClient(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/create-client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientForm),
        });
        const data = await res.json();
        if (data.error) { alert("Error: " + data.error); return; }
        setClientForm({ name: "", email: "", phone: "", company: "" });
        setShowAddClient(false);
        fetchClients();
    }

    async function addProject(e: React.FormEvent) {
        e.preventDefault();
        const { data } = await supabase.from("projects").insert([projectForm]).select().single();
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

    async function addInvoice(e: React.FormEvent) {
        e.preventDefault();
        await supabase.from("invoices").insert([invoiceForm]);
        setInvoiceForm({ project_id: "", client_id: "", amount: 0, currency: "PKR", due_date: "", description: "" });
        setShowAddInvoice(false);
        fetchInvoices();
    }

    async function updateInvoiceStatus(id: string, status: string) {
        const update: any = { status };
        if (status === "paid") update.paid_date = new Date().toISOString();
        await supabase.from("invoices").update(update).eq("id", id);
        fetchInvoices();
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

    const inputStyle: React.CSSProperties = {
        padding: "12px 16px", borderRadius: 10,
        border: "1.5px solid rgba(0,0,0,0.1)",
        fontSize: 14, fontFamily: "var(--font-outfit)",
        color: "#1d1d1f", background: "#f5f5f7",
        outline: "none", width: "100%",
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 12, color: "#6e6e73",
        fontFamily: "var(--font-outfit)",
        letterSpacing: "0.04em", marginBottom: 6,
        display: "block",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar */}
            <div style={{ background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f" }}>
                    Synve<span style={{ color: "#0071e3" }}>.</span> Admin
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>{user?.email}</span>
                    <button onClick={handleLogout} style={{ fontSize: 13, color: "#ff3b30", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)", padding: "8px 20px", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>Logout</button>
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
                        <div key={stat.label} style={{ background: "#ffffff", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(0,0,0,0.06)" }}>
                            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 42, fontWeight: 300, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginTop: 8 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#ffffff", borderRadius: 12, padding: 4, width: "fit-content", border: "1px solid rgba(0,0,0,0.06)" }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", fontFamily: "var(--font-outfit)", fontSize: 14, cursor: "pointer", background: activeTab === tab ? "#0071e3" : "transparent", color: activeTab === tab ? "white" : "#6e6e73", transition: "all 0.2s" }}>{tab}</button>
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
                                                <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 980, border: `1.5px solid ${statusColors[lead.status]}44`, background: `${statusColors[lead.status]}10`, color: statusColors[lead.status], fontFamily: "var(--font-outfit)", cursor: "pointer", outline: "none" }}>
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
                                                <button onClick={() => deleteLead(lead.id)} style={{ fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>Delete</button>
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
                            <button onClick={() => setShowAddClient(true)} style={{ fontSize: 14, background: "#0071e3", color: "white", padding: "12px 28px", border: "none", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>+ Add Client</button>
                        </div>
                        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f" }}>All Clients</h2>
                            </div>
                            {clients.length === 0 ? (
                                <div style={{ padding: "60px", textAlign: "center", color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>No clients yet.</div>
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
                                                    <button onClick={() => deleteClient(client.id)} style={{ fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>Delete</button>
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
                            <button onClick={() => setShowAddProject(true)} style={{ fontSize: 14, background: "#0071e3", color: "white", padding: "12px 28px", border: "none", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>+ Add Project</button>
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
                                                    <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 980, background: project.type === "web" ? "rgba(0,113,227,0.1)" : project.type === "iot" ? "rgba(52,199,89,0.1)" : project.type === "mobile" ? "rgba(255,149,0,0.1)" : "rgba(175,82,222,0.1)", color: project.type === "web" ? "#0071e3" : project.type === "iot" ? "#34c759" : project.type === "mobile" ? "#ff9500" : "#af52de", fontFamily: "var(--font-outfit)" }}>{project.type}</span>
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
                                                    <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 980, background: project.status === "in_progress" ? "rgba(0,113,227,0.1)" : project.status === "completed" ? "rgba(52,199,89,0.1)" : project.status === "on_hold" ? "rgba(255,149,0,0.1)" : "rgba(255,59,48,0.1)", color: project.status === "in_progress" ? "#0071e3" : project.status === "completed" ? "#34c759" : project.status === "on_hold" ? "#ff9500" : "#ff3b30", fontFamily: "var(--font-outfit)" }}>{project.status.replace("_", " ")}</span>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 12, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <button onClick={() => deleteProject(project.id)} style={{ fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* INVOICES TAB */}
                {activeTab === "Invoices" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                            <button onClick={() => setShowAddInvoice(true)} style={{ fontSize: 14, background: "#0071e3", color: "white", padding: "12px 28px", border: "none", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>+ Create Invoice</button>
                        </div>

                        {/* Invoice stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                            {[
                                { label: "Total Invoiced", value: `PKR ${invoices.reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: "#0071e3" },
                                { label: "Unpaid", value: `PKR ${invoices.filter(i => i.status === "unpaid").reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: "#ff9500" },
                                { label: "Paid", value: `PKR ${invoices.filter(i => i.status === "paid").reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: "#34c759" },
                            ].map(stat => (
                                <div key={stat.label} style={{ background: "#ffffff", borderRadius: 16, padding: "24px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                    <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                    <div style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginTop: 8 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f" }}>All Invoices</h2>
                            </div>
                            {invoices.length === 0 ? (
                                <div style={{ padding: "60px", textAlign: "center", color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>No invoices yet.</div>
                            ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f5f5f7" }}>
                                            {["Client", "Project", "Amount", "Description", "Status", "Due Date", ""].map(h => (
                                                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice, i) => (
                                            <tr key={invoice.id} style={{ borderTop: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                                                <td style={{ padding: "14px 20px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)" }}>
                                                    {clients.find(c => c.id === invoice.client_id)?.name || "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                                                    {projects.find(p => p.id === invoice.project_id)?.title || "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>
                                                    {invoice.currency} {invoice.amount.toLocaleString()}
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", maxWidth: 200 }}>
                                                    {invoice.description?.slice(0, 40)}{invoice.description?.length > 40 ? "..." : ""}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <select value={invoice.status} onChange={e => updateInvoiceStatus(invoice.id, e.target.value)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 980, border: `1.5px solid ${invoice.status === "paid" ? "#34c75944" : invoice.status === "overdue" ? "#ff3b3044" : "#ff950044"}`, background: invoice.status === "paid" ? "rgba(52,199,89,0.1)" : invoice.status === "overdue" ? "rgba(255,59,48,0.1)" : "rgba(255,149,0,0.1)", color: invoice.status === "paid" ? "#34c759" : invoice.status === "overdue" ? "#ff3b30" : "#ff9500", fontFamily: "var(--font-outfit)", cursor: "pointer", outline: "none" }}>
                                                        <option value="unpaid">Unpaid</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="overdue">Overdue</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontSize: 12, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <button onClick={() => deleteInvoice(invoice.id)} style={{ fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)", padding: "6px 14px", borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer" }}>Delete</button>
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
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAddClient(false)}>
                    <div style={{ background: "#ffffff", borderRadius: 24, padding: "48px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
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
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAddProject(false)}>
                    <div style={{ background: "#ffffff", borderRadius: 24, padding: "48px", width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
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

            {/* Add Invoice Modal */}
            {showAddInvoice && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAddInvoice(false)}>
                    <div style={{ background: "#ffffff", borderRadius: 24, padding: "48px", width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f", marginBottom: 32 }}>Create Invoice</h2>
                        <form onSubmit={addInvoice} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Client</label>
                                <select required style={inputStyle} value={invoiceForm.client_id} onChange={e => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}>
                                    <option value="">Select a client</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Project</label>
                                <select required style={inputStyle} value={invoiceForm.project_id} onChange={e => setInvoiceForm({ ...invoiceForm, project_id: e.target.value })}>
                                    <option value="">Select a project</option>
                                    {projects.filter(p => p.client_id === invoiceForm.client_id).map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={labelStyle}>Amount</label>
                                    <input required type="number" style={inputStyle} value={invoiceForm.amount} onChange={e => setInvoiceForm({ ...invoiceForm, amount: parseInt(e.target.value) })} placeholder="50000" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Currency</label>
                                    <select style={inputStyle} value={invoiceForm.currency} onChange={e => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}>
                                        <option value="PKR">PKR</option>
                                        <option value="USD">USD</option>
                                        <option value="GBP">GBP</option>
                                        <option value="AED">AED</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Due Date</label>
                                <input required type="date" style={inputStyle} value={invoiceForm.due_date} onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={invoiceForm.description} onChange={e => setInvoiceForm({ ...invoiceForm, description: e.target.value })} placeholder="e.g. 50% advance payment for web development project" />
                            </div>
                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowAddInvoice(false)} style={{ flex: 1, padding: "14px", borderRadius: 980, border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "#6e6e73" }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: "14px", borderRadius: 980, border: "none", background: "#0071e3", fontSize: 14, fontFamily: "var(--font-outfit)", cursor: "pointer", color: "white" }}>Create Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}