import type { APIRoute } from 'astro';
import { sendEmail } from '../../lib/email';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, subject, message, festivalName, festivalDate } = data;

        // Construct email body
        let emailBody = `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Topic:</strong> ${subject}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <pre>${message}</pre>
        `;

        // Add festival details if present
        if (festivalName) {
            emailBody += `
                <hr/>
                <h3>Festival Submission Details</h3>
                <p><strong>Name:</strong> ${festivalName}</p>
                <p><strong>Date:</strong> ${festivalDate || 'N/A'}</p>
            `;
        }

        // Send email to admin
        await sendEmail({
            to: 'hello@niko-endres.de', // Send to admin
            subject: `[Contact Form] ${subject || 'New Message'} - ${name}`,
            html: emailBody,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });

        // Optional: Send auto-reply to user
        // await sendEmail({ to: email, ... })

        return new Response(JSON.stringify({
            message: "Success"
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            message: "Internal Server Error"
        }), { status: 500 });
    }
}
