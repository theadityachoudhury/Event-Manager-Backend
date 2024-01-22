import mongoose from "mongoose";

/**
 * Mongoose schema for the Contact model, representing contact form submissions.
 */
const ContactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("Contact", ContactSchema);
