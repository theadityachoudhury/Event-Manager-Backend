import mongoose from "mongoose";

const eMailLogSchema = new mongoose.Schema(
	{
		to: {
			type: [String],
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		messageId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("emailLogs", eMailLogSchema);
