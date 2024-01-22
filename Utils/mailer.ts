import nodemailer from "nodemailer";
import Config from "../Config";
import EmailLogs from "../Models/EmailLogs";

const { SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_HOST } = Config;

/**
 * Saves an email message to the database for tracking and logging purposes.
 *
 * @param to - Email recipient(s).
 * @param subject - Email subject.
 * @param body - Email body content.
 * @param status - Status of the email (e.g., "success", "failure").
 * @param type - Type of email (e.g., "verification", "notification").
 * @param messageId - Unique identifier for the email message.
 */
const save_message = async (
    to: string,
    subject: string,
    body: string,
    status: string,
    type: string,
    messageId: string
) => {
    let log = new EmailLogs({
        to,
        subject,
        body,
        status,
        type,
        messageId,
    });
    await log.save();
};

/**
 * Sends an email using Nodemailer with the specified parameters.
 *
 * @param to - Email recipient(s).
 * @param subject - Email subject.
 * @param hbody - HTML body content of the email.
 * @param type - Type of email (e.g., "verification", "notification").
 */
export const mailer = async (
    to: any,
    subject: string,
    hbody: string,
    type: string
) => {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    // Ensure 'to' is an array
    if (!Array.isArray(to)) {
        to = [to];
    }

    let message = {
        from: '"Aditya Choudhury" <aditya@adityachoudhury.com>', // sender address
        to: to.join(", "), // List of receivers, join the array into a comma-separated string
        subject: subject, // Subject line
        html: hbody, // HTML body
    };

    // Send the email
    let info = await transporter.sendMail(message);

    // Save the message details to the database
    for (const recipient of to) {
        save_message(
            recipient,
            subject,
            hbody,
            "success",
            type,
            info.messageId
        );
    }
    return;
};
