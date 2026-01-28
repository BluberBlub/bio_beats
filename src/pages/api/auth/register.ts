import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// Initialize Resend with API Key (should be in env vars in production)
// Using a placeholder for now, user will need to valid key
const resend = new Resend('re_123456789');

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
        // Note: In development/without verified domain, can typically only send to the verified account email
        // For this demo, we'll try to send it, but catch errors gracefully
        try {
            /* 
            // Real sending logic (commented out until valid key provided)
            await resend.emails.send({
                from: 'BIO BEATS <onboarding@resend.dev>',
                to: [email],
                subject: 'Verify your BIO BEATS account',
                html: `
                <div style="font-family: sans-serif; max-w-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
                    <h1>Welcome to BIO BEATS!</h1>
                    <p>Hi ${name},</p>
                    <p>Thanks for joining the platform as a <strong>${role}</strong> from ${country || 'Earth'}.</p>
                    <p>Please click the button below to verify your email address and activate your account:</p>
                    <a href="${verificationUrl}" style="display: inline-block; background: #ff0700; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
                    <p>If you didn't create this account, you can ignore this email.</p>
                </div>
                `
            });
            */

            // For demo purposes, simply log the "sent" email
            console.log(`[Mock Email] To: ${email}, Link: ${verificationUrl}`);

        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Continue flow even if email fails in dev mode, but return warning
            // In prod, this should likely fail the request
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
