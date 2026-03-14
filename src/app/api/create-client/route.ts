import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, email, phone, company } = await request.json();

    // Create auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(-10) + "A1!",
        email_confirm: true,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Add to clients table
    const { error: clientError } = await supabaseAdmin.from("clients").insert([{
        id: data.user.id,
        name, email, phone, company,
    }]);

    if (clientError) return NextResponse.json({ error: clientError.message }, { status: 400 });

    return NextResponse.json({ success: true, userId: data.user.id });
}