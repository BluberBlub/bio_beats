import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.de',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'hello@niko-endres.de',
        pass: '2k26Schnitzel1$',
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html?: string; text?: string }) {
    try {
        const info = await transporter.sendMail({
            from: '"BIO BEATS" <hello@niko-endres.de>', // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
