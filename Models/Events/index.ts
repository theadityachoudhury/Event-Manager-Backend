import mongoose from "mongoose";

/**
 * Mongoose schema for the eventSchema model, representing event entries.
 */
const eventsSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true
        },
        eventDescription: {
            type: String,
            required: true
        },
        eventCategory: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Category"
        },
        eventLocation: {
            type: String,
            required: true
        },
        eventStartDate: {
            type: Date,
            required: true
        },
        eventEndDate: {
            type: Date,
            required: true
        },
        eventURL: {
            type: String,
            required: false
        },
        eventImageUploaded: {
            type: Boolean,
            default: false
        },
        eventOwner: {
            type: String,
            required: true
        },
        ownerId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Users"
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        free: {
            type: Boolean,
            required: true,
            default: true
        },
        eventType: {
            type: String,
            required: true,
            enum: ["open", "closed"],
            default: "open"
        },
        eventParticipationLimit: {
            type: Number,
            default: 100,
            required: true
        },
        eventAttendanceRequired: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Events schema.
 */
export default mongoose.model("Events", eventsSchema);