import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, email, phone, company } = await request.json();

    // Invite user via email (sends magic link automatically)
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/client/onboarding`,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Add to clients table
    const { error: clientError } = await supabaseAdmin.from("clients").insert([{
        id: data.user.id,
        name, email, phone, company,
    }]);

    if (clientError) return NextResponse.json({ error: clientError.message }, { status: 400 });

    return NextResponse.json({ success: true });
}
