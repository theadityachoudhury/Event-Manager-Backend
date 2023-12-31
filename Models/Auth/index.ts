import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		auth_type: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Auth", authSchema);
