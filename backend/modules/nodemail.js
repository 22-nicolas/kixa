import nodemailer from "nodemailer";
import fs from "fs";

export async function sendEmail( toMail, subject, body ) {
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
            html: body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export async function sendConfirmationEmail(order) {
    const { id } = order;
    const email = order.payer?.email_address || order.customer_details?.email;
    const name = order.payer?.name?.given_name || order.customer_details?.name?.split(" ")[0] || "Customer";

    let orderConfirmationMail = fs.readFileSync("./backend/modules/orderConfirmationMail.html", "utf-8");
    orderConfirmationMail = orderConfirmationMail
                                                .replace("{{ name }}", name || "Customer")
                                                .replace("{{ order_id }}", id)

    sendEmail("teddycraft64@gmail.com", `Order ${id}: Order Confirmation`, orderConfirmationMail)
}