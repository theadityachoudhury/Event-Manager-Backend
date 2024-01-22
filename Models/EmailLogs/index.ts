import mongoose from "mongoose";

/**
 * Mongoose schema for the EmailLogs model, representing email log entries.
 */
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

/**
 * Mongoose model for the EmailLogs schema.
 */
export default mongoose.model("EmailLogs", eMailLogSchema);
