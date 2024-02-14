import mongoose from "mongoose";

/**
 * Mongoose schema for the Contact model, representing contact form submissions.
 */
const EventRegisteredSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Users"
        },
        eventId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Events"
        },
        attended: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("EventRegistered", EventRegisteredSchema);
