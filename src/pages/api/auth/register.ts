import type { APIRoute } from 'astro';
import { sendEmail } from '../../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { email, name, role, country, password } = data;

        // Basic validation
        if (!email || !name || !password || !role) {
            return new Response(
                JSON.stringify({
                    message: 'Missing required fields',
                }),
                { status: 400 }
            );
        }

        // In a real app, you would:
        // 1. Hash the password
        // 2. Check if user already exists in DB
        // 3. Create user record in DB with 'pending' status

        // Mock user creation delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create verification token (mock)
        const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');
        const verificationUrl = `${new URL(request.url).origin}/verify/${token}`;

        // Send verification email
        try {
            await sendEmail({
                to: email,
                subject: 'Verify your BIO BEATS account',
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #171717; color: #fff; padding: 20px; border-radius: 12px; border: 1px solid #262626;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #ff0700; margin: 0;">BIO BEATS</h1>
                    </div>
                    <p style="color: #d4d4d4; font-size: 16px;">Hi ${name},</p>
                    <p style="color: #a3a3a3; line-height: 1.6;">Thanks for joining the platform as a <strong>${role}</strong> from ${country || 'Earth'}.</p>
                    <p style="color: #a3a3a3; line-height: 1.6;">Please click the button below to verify your email address and activate your account:</p>
                    <div style="text-align: center;">
                        <a href="${verificationUrl}" style="display: inline-block; background: #ff0700; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 24px 0; font-weight: bold;">Verify Email</a>
                    </div>
                    <p style="color: #737373; font-size: 14px; margin-top: 24px;">If you didn't create this account, you can ignore this email.</p>
                </div>
                `
            });
            console.log(`[Email Sent] To: ${email}, Link: ${verificationUrl}`);

        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            return new Response(JSON.stringify({ message: 'Failed to send verification email' }), { status: 500 });
        }

        return new Response(
            JSON.stringify({
                message: 'Account created successfully',
                token: token // Returning token for dev purposes/auto-login in demo
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return new Response(
            JSON.stringify({
                message: 'Internal server error',
            }),
            { status: 500 }
        );
    }
};
