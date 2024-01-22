import mongoose from "mongoose";

/**
 * Mongoose schema for the Auth model, representing user authentication information.
 */
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

/**
 * Mongoose model for the Auth schema.
 */
export default mongoose.model("Auth", authSchema);
