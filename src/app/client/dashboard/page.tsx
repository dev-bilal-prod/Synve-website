"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Project = {
    id: string;
    title: string;
    type: string;
    status: string;
    progress: number;
    start_date: string;
    deadline: string;
    notes: string;
};

type Update = {
    id: string;
    message: string;
    created_at: string;
};

type WebDetails = {
    pages: { name: string; status: string }[];
    design_approved: boolean;
    revisions_used: number;
    revisions_total: number;
    testing_done: boolean;
    live: boolean;
    live_url: string;
};

type IotDetails = {
    hardware_status: string;
    firmware_version: string;
    sensors: { name: string; tested: boolean }[];
    dashboard_live: boolean;
    dashboard_url: string;
    deployed: boolean;
    deployment_location: string;
};

type MobileDetails = {
    screens: { name: string; status: string }[];
    android_status: string;
    ios_status: string;
    beta_testing: boolean;
    beta_link: string;
    android_live: boolean;
    ios_live: boolean;
    play_store_link: string;
    app_store_link: string;
};

type ManagedDetails = {
    uptime_percent: number;
    tickets_open: number;
    tickets_resolved: number;
    this_month_summary: string;
    next_renewal: string;
    services_included: string[];
};

export default function ClientDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [updates, setUpdates] = useState<Update[]>([]);
    const [webDetails, setWebDetails] = useState<WebDetails | null>(null);
    const [iotDetails, setIotDetails] = useState<IotDetails | null>(null);
    const [mobileDetails, setMobileDetails] = useState<MobileDetails | null>(null);
    const [managedDetails, setManagedDetails] = useState<ManagedDetails | null>(null);
    const [clientName, setClientName] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (selectedProject) fetchProjectDetails(selectedProject);
    }, [selectedProject]);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/client/login"); return; }

        const { data: client } = await supabase.from("clients").select("*").eq("id", user.id).single();
        if (client) setClientName(client.name);

        const { data: projectsData } = await supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false });
        if (projectsData && projectsData.length > 0) {
            setProjects(projectsData);
            setSelectedProject(projectsData[0]);
        }
        setLoading(false);
    }

    async function fetchProjectDetails(project: Project) {
        setWebDetails(null);
        setIotDetails(null);
        setMobileDetails(null);
        setManagedDetails(null);

        const { data: updatesData } = await supabase.from("project_updates").select("*").eq("project_id", project.id).order("created_at", { ascending: false });
        if (updatesData) setUpdates(updatesData);

        if (project.type === "web") {
            const { data } = await supabase.from("web_details").select("*").eq("project_id", project.id).single();
            if (data) setWebDetails(data);
        }
        if (project.type === "iot") {
            const { data } = await supabase.from("iot_details").select("*").eq("project_id", project.id).single();
            if (data) setIotDetails(data);
        }
        if (project.type === "mobile") {
            const { data } = await supabase.from("mobile_details").select("*").eq("project_id", project.id).single();
            if (data) setMobileDetails(data);
        }
        if (project.type === "managed") {
            const { data } = await supabase.from("managed_details").select("*").eq("project_id", project.id).single();
            if (data) setManagedDetails(data);
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/client/login");
    }

    const statusColor = (status: string) => {
        if (status === "in_progress") return "#0071e3";
        if (status === "completed") return "#34c759";
        if (status === "on_hold") return "#ff9500";
        return "#ff3b30";
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f7" }}>
            <p style={{ fontFamily: "var(--font-outfit)", color: "#6e6e73" }}>Loading your dashboard...</p>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>

            {/* Navbar */}
            <div style={{
                background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "20px 48px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
            }}>
                <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, fontWeight: 300, color: "#1d1d1f" }}>
                    Synve<span style={{ color: "#0071e3" }}>.</span>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)" }}>
                        👋 {clientName}
                    </span>
                    <button onClick={handleLogout} style={{
                        fontSize: 13, color: "#ff3b30", background: "rgba(255,59,48,0.08)",
                        border: "1px solid rgba(255,59,48,0.2)", padding: "8px 20px",
                        borderRadius: 980, fontFamily: "var(--font-outfit)", cursor: "pointer",
                    }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: "40px 48px", maxWidth: 1200, margin: "0 auto" }}>

                {projects.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "100px 40px",
                        background: "#ffffff", borderRadius: 24,
                        border: "1px solid rgba(0,0,0,0.06)",
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, fontWeight: 300, color: "#1d1d1f", marginBottom: 12 }}>
                            No projects yet
                        </h2>
                        <p style={{ fontSize: 15, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                            Your projects will appear here once Synve sets them up for you.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>

                        {/* Project list sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "#6e6e73", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                                Your Projects
                            </h3>
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    style={{
                                        background: selectedProject?.id === project.id ? "#0071e3" : "#ffffff",
                                        borderRadius: 16, padding: "20px",
                                        border: "1px solid rgba(0,0,0,0.06)",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <div style={{ fontSize: 14, fontFamily: "var(--font-outfit)", fontWeight: 400, color: selectedProject?.id === project.id ? "white" : "#1d1d1f", marginBottom: 8 }}>
                                        {project.title}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <span style={{
                                            fontSize: 11, padding: "3px 10px", borderRadius: 980,
                                            background: selectedProject?.id === project.id ? "rgba(255,255,255,0.2)" : "rgba(0,113,227,0.1)",
                                            color: selectedProject?.id === project.id ? "white" : "#0071e3",
                                            fontFamily: "var(--font-outfit)",
                                        }}>{project.type}</span>
                                        <span style={{ fontSize: 11, color: selectedProject?.id === project.id ? "rgba(255,255,255,0.7)" : "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                            {project.progress}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Project details */}
                        {selectedProject && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                {/* Header card */}
                                <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                                        <div>
                                            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, fontWeight: 300, color: "#1d1d1f", marginBottom: 8 }}>
                                                {selectedProject.title}
                                            </h2>
                                            <span style={{
                                                fontSize: 12, padding: "4px 14px", borderRadius: 980,
                                                background: `${statusColor(selectedProject.status)}15`,
                                                color: statusColor(selectedProject.status),
                                                fontFamily: "var(--font-outfit)",
                                            }}>
                                                {selectedProject.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            {selectedProject.deadline && (
                                                <div>
                                                    <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 4 }}>Deadline</div>
                                                    <div style={{ fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)" }}>
                                                        {new Date(selectedProject.deadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>Overall Progress</span>
                                            <span style={{ fontSize: 13, color: "#0071e3", fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{selectedProject.progress}%</span>
                                        </div>
                                        <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 4 }}>
                                            <div style={{
                                                width: `${selectedProject.progress}%`, height: "100%",
                                                background: "linear-gradient(90deg, #0071e3, #00c6ff)",
                                                borderRadius: 4, transition: "width 0.6s ease",
                                            }} />
                                        </div>
                                    </div>

                                    {selectedProject.notes && (
                                        <p style={{ fontSize: 14, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginTop: 16, lineHeight: 1.6 }}>
                                            {selectedProject.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Type specific details */}
                                {selectedProject.type === "web" && webDetails && (
                                    <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 24 }}>Web Project Details</h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                                            {[
                                                { label: "Design Approved", value: webDetails.design_approved ? "✅ Yes" : "⏳ Pending", color: webDetails.design_approved ? "#34c759" : "#ff9500" },
                                                { label: "Testing Done", value: webDetails.testing_done ? "✅ Yes" : "⏳ Pending", color: webDetails.testing_done ? "#34c759" : "#ff9500" },
                                                { label: "Live", value: webDetails.live ? "🚀 Live" : "⏳ Not yet", color: webDetails.live ? "#34c759" : "#ff9500" },
                                            ].map(item => (
                                                <div key={item.label} style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px" }}>
                                                    <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 8 }}>{item.label}</div>
                                                    <div style={{ fontSize: 15, color: item.color, fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>Revisions Used</span>
                                            <span style={{ fontSize: 13, color: "#1d1d1f", fontFamily: "var(--font-outfit)" }}>{webDetails.revisions_used} / {webDetails.revisions_total}</span>
                                        </div>
                                        {webDetails.pages && webDetails.pages.length > 0 && (
                                            <div style={{ marginTop: 20 }}>
                                                <h4 style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginBottom: 12 }}>Pages</h4>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    {webDetails.pages.map((page: any) => (
                                                        <span key={page.name} style={{
                                                            fontSize: 13, padding: "6px 16px", borderRadius: 980,
                                                            background: page.status === "done" ? "rgba(52,199,89,0.1)" : page.status === "in_progress" ? "rgba(0,113,227,0.1)" : "rgba(0,0,0,0.06)",
                                                            color: page.status === "done" ? "#34c759" : page.status === "in_progress" ? "#0071e3" : "#6e6e73",
                                                            fontFamily: "var(--font-outfit)",
                                                        }}>
                                                            {page.status === "done" ? "✅" : page.status === "in_progress" ? "🔄" : "⏳"} {page.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {webDetails.live_url && (
                                            <a href={webDetails.live_url} target="_blank" rel="noreferrer" style={{
                                                display: "inline-block", marginTop: 20, fontSize: 14,
                                                color: "#0071e3", fontFamily: "var(--font-outfit)",
                                            }}>🔗 View Live Site →</a>
                                        )}
                                    </div>
                                )}

                                {selectedProject.type === "iot" && iotDetails && (
                                    <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 24 }}>IoT Project Details</h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                                            {[
                                                { label: "Hardware Status", value: iotDetails.hardware_status, color: iotDetails.hardware_status === "deployed" ? "#34c759" : "#ff9500" },
                                                { label: "Firmware Version", value: iotDetails.firmware_version, color: "#0071e3" },
                                                { label: "Deployed", value: iotDetails.deployed ? "✅ Yes" : "⏳ Pending", color: iotDetails.deployed ? "#34c759" : "#ff9500" },
                                            ].map(item => (
                                                <div key={item.label} style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px" }}>
                                                    <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 8 }}>{item.label}</div>
                                                    <div style={{ fontSize: 15, color: item.color, fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {iotDetails.sensors && iotDetails.sensors.length > 0 && (
                                            <div>
                                                <h4 style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginBottom: 12 }}>Sensors</h4>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    {iotDetails.sensors.map((sensor: any) => (
                                                        <span key={sensor.name} style={{
                                                            fontSize: 13, padding: "6px 16px", borderRadius: 980,
                                                            background: sensor.tested ? "rgba(52,199,89,0.1)" : "rgba(0,0,0,0.06)",
                                                            color: sensor.tested ? "#34c759" : "#6e6e73",
                                                            fontFamily: "var(--font-outfit)",
                                                        }}>
                                                            {sensor.tested ? "✅" : "⏳"} {sensor.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {iotDetails.dashboard_url && (
                                            <a href={iotDetails.dashboard_url} target="_blank" rel="noreferrer" style={{
                                                display: "inline-block", marginTop: 20, fontSize: 14,
                                                color: "#0071e3", fontFamily: "var(--font-outfit)",
                                            }}>🔗 View IoT Dashboard →</a>
                                        )}
                                    </div>
                                )}

                                {selectedProject.type === "mobile" && mobileDetails && (
                                    <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 24 }}>Mobile App Details</h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
                                            {[
                                                { label: "Android Status", value: mobileDetails.android_status, color: "#34c759" },
                                                { label: "iOS Status", value: mobileDetails.ios_status, color: "#0071e3" },
                                                { label: "Beta Testing", value: mobileDetails.beta_testing ? "✅ Active" : "⏳ Pending", color: mobileDetails.beta_testing ? "#34c759" : "#ff9500" },
                                                { label: "App Store", value: mobileDetails.android_live || mobileDetails.ios_live ? "🚀 Live" : "⏳ Pending", color: mobileDetails.android_live || mobileDetails.ios_live ? "#34c759" : "#ff9500" },
                                            ].map(item => (
                                                <div key={item.label} style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px" }}>
                                                    <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 8 }}>{item.label}</div>
                                                    <div style={{ fontSize: 15, color: item.color, fontFamily: "var(--font-outfit)", fontWeight: 400 }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {mobileDetails.screens && mobileDetails.screens.length > 0 && (
                                            <div>
                                                <h4 style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)", marginBottom: 12 }}>Screens</h4>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    {mobileDetails.screens.map((screen: any) => (
                                                        <span key={screen.name} style={{
                                                            fontSize: 13, padding: "6px 16px", borderRadius: 980,
                                                            background: screen.status === "done" ? "rgba(52,199,89,0.1)" : screen.status === "in_progress" ? "rgba(0,113,227,0.1)" : "rgba(0,0,0,0.06)",
                                                            color: screen.status === "done" ? "#34c759" : screen.status === "in_progress" ? "#0071e3" : "#6e6e73",
                                                            fontFamily: "var(--font-outfit)",
                                                        }}>
                                                            {screen.status === "done" ? "✅" : screen.status === "in_progress" ? "🔄" : "⏳"} {screen.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                                            {mobileDetails.beta_link && <a href={mobileDetails.beta_link} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#0071e3", fontFamily: "var(--font-outfit)" }}>🔗 Beta Link →</a>}
                                            {mobileDetails.play_store_link && <a href={mobileDetails.play_store_link} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#34c759", fontFamily: "var(--font-outfit)" }}>▶ Play Store →</a>}
                                            {mobileDetails.app_store_link && <a href={mobileDetails.app_store_link} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#0071e3", fontFamily: "var(--font-outfit)" }}>🍎 App Store →</a>}
                                        </div>
                                    </div>
                                )}

                                {selectedProject.type === "managed" && managedDetails && (
                                    <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 24 }}>IT Managed Services</h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                                            {[
                                                { label: "Uptime", value: `${managedDetails.uptime_percent}%`, color: "#34c759" },
                                                { label: "Open Tickets", value: managedDetails.tickets_open, color: managedDetails.tickets_open > 0 ? "#ff9500" : "#34c759" },
                                                { label: "Resolved Tickets", value: managedDetails.tickets_resolved, color: "#0071e3" },
                                            ].map(item => (
                                                <div key={item.label} style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px" }}>
                                                    <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 8 }}>{item.label}</div>
                                                    <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 36, fontWeight: 300, color: item.color as string, lineHeight: 1 }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {managedDetails.this_month_summary && (
                                            <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
                                                <div style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)", marginBottom: 8 }}>This Month's Summary</div>
                                                <p style={{ fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", lineHeight: 1.6 }}>{managedDetails.this_month_summary}</p>
                                            </div>
                                        )}
                                        {managedDetails.next_renewal && (
                                            <div style={{ fontSize: 13, color: "#6e6e73", fontFamily: "var(--font-outfit)" }}>
                                                Next Renewal: <span style={{ color: "#1d1d1f" }}>{new Date(managedDetails.next_renewal).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Updates */}
                                <div style={{ background: "#ffffff", borderRadius: 20, padding: "32px", border: "1px solid rgba(0,0,0,0.06)" }}>
                                    <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 24, fontWeight: 300, color: "#1d1d1f", marginBottom: 20 }}>Project Updates</h3>
                                    {updates.length === 0 ? (
                                        <p style={{ fontSize: 14, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>No updates yet. Check back soon!</p>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                            {updates.map(update => (
                                                <div key={update.id} style={{
                                                    padding: "20px", background: "#f5f5f7",
                                                    borderRadius: 12, borderLeft: "3px solid #0071e3",
                                                }}>
                                                    <p style={{ fontSize: 14, color: "#1d1d1f", fontFamily: "var(--font-outfit)", lineHeight: 1.6, marginBottom: 8 }}>
                                                        {update.message}
                                                    </p>
                                                    <span style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
                                                        {new Date(update.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}