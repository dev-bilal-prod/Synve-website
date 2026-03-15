import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { clientId } = await request.json();

    // Delete from clients table
    await supabaseAdmin.from("clients").delete().eq("id", clientId);

    // Delete from auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(clientId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
}