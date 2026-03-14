import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    const { name, email, service, message } = await request.json();

    try {
        await resend.emails.send({
            from: "Synve <onboarding@resend.dev>",
            to: "dev.belal.prod@gmail.com", // replace with your actual email
            subject: `New Lead: ${name} — ${service}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="font-size: 28px; font-weight: 300; color: #1d1d1f; margin-bottom: 8px;">
            New Lead from Synve
          </h1>
          <p style="color: #6e6e73; font-size: 14px; margin-bottom: 32px;">
            Someone just filled out the contact form on your website.
          </p>

          <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-size: 13px; color: #6e6e73; width: 100px;">Name</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1d1d1f; font-weight: 500;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(0,0,0,0.06);">
                <td style="padding: 10px 0; font-size: 13px; color: #6e6e73;">Email</td>
                <td style="padding: 10px 0; font-size: 14px; color: #0071e3;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(0,0,0,0.06);">
                <td style="padding: 10px 0; font-size: 13px; color: #6e6e73;">Service</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1d1d1f;">${service}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 13px; color: #6e6e73; margin-bottom: 8px;">Message</p>
            <p style="font-size: 15px; color: #1d1d1f; line-height: 1.6;">${message}</p>
          </div>

          <a href="https://synve-website.vercel.app/" 
            style="background: #0071e3; color: white; padding: 14px 32px; 
            border-radius: 980px; text-decoration: none; font-size: 14px;">
            View in Dashboard →
          </a>

          <p style="font-size: 12px; color: #a1a1a6; margin-top: 32px;">
            Synve Admin Notifications
          </p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}