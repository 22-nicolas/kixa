import nodemailer from "nodemailer";

export async function sendEmail( toMail, subject, text ) {
    try{
        // Create transporter (connects to email service)
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use SMTP config
            auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Email details
        const mailOptions = {
            from: process.env.GMAIL,
            to: toMail,
            subject: subject,
            text: text,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}