import nodemailer from "nodemailer";
import Config from "../Config";
import EmailLogs from "../Models/EmailLogs";

const { SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_HOST } = Config;

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
	if (!Array.isArray(to)) {
		to = [to];
	}

	let message = {
		from: '"Aditya Choudhury" <aditya@adityachoudhury.com>', // sender address
		to: to.join(", "), // List of receivers, join the array into a comma-separated string
		subject: subject, // Subject line
		html: hbody, // html body
	};

	let info = await transporter.sendMail(message);
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