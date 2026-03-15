import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { clientId } = await request.json();

    try {
        // Delete related data first
        await supabaseAdmin.from("invoices").delete().eq("client_id", clientId);
        await supabaseAdmin.from("messages").delete().eq("client_id", clientId);

        // Get all projects for this client
        const { data: projects } = await supabaseAdmin
            .from("projects")
            .select("id")
            .eq("client_id", clientId);

        if (projects && projects.length > 0) {
            const projectIds = projects.map(p => p.id);

            // Delete project related data
            await supabaseAdmin.from("project_updates").delete().in("project_id", projectIds);
            await supabaseAdmin.from("web_details").delete().in("project_id", projectIds);
            await supabaseAdmin.from("iot_details").delete().in("project_id", projectIds);
            await supabaseAdmin.from("mobile_details").delete().in("project_id", projectIds);
            await supabaseAdmin.from("managed_details").delete().in("project_id", projectIds);

            // Delete projects
            await supabaseAdmin.from("projects").delete().eq("client_id", clientId);
        }

        // Delete from clients table
        await supabaseAdmin.from("clients").delete().eq("id", clientId);

        // Delete from auth
        const { error } = await supabaseAdmin.auth.admin.deleteUser(clientId);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}