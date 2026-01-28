import type { APIRoute } from 'astro';
import { sendEmail } from '../../../lib/email';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        // Generate a new mock token
        const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');
        const verificationUrl = `${new URL(request.url).origin}/verify/${token}`;

        await sendEmail({
            to: email,
            subject: 'Verify your BIO BEATS account (Resent)',
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #171717; color: #fff; padding: 20px; border-radius: 12px; border: 1px solid #262626;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #ff0700; margin: 0;">BIO BEATS</h1>
                </div>
                <p style="color: #d4d4d4; font-size: 16px;">Hi there,</p>
                <p style="color: #a3a3a3; line-height: 1.6;">You requested a new verification link.</p>
                <p style="color: #a3a3a3; line-height: 1.6;">Please click the button below to verify your email address:</p>
                <div style="text-align: center;">
                    <a href="${verificationUrl}" style="display: inline-block; background: #ff0700; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 24px 0; font-weight: bold;">Verify Email</a>
                </div>
                <p style="color: #737373; font-size: 14px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
            `
        });

        console.log(`[Resend Email] To: ${email}, Link: ${verificationUrl}`);

        return new Response(JSON.stringify({ success: true, message: 'Email sent' }), { status: 200 });

    } catch (error) {
        console.error('Resend error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
