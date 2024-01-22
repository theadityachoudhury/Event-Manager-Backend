import mongoose from "mongoose";

/**
 * Mongoose schema for the Users model, representing user information.
 */
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		mobile: {
			type: Number,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
		verified: {
			type: Boolean,
			default: false,
		},
		face: {
			type: Boolean,
			default: false,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

/**
 * Mongoose model for the Users schema.
 */
export default mongoose.model("Users", UserSchema);
