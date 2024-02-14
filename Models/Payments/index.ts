import mongoose from "mongoose";

/**
 * Mongoose schema for the Contact model, representing contact form submissions.
 */
const PaymentsSchema = new mongoose.Schema(
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
        registrationId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "EventRegistered"
        },
        amount: {
            type: Number,
            required: true,
        },
        amountPaid: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
        },
        referenceNumber: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true,
        },
        international: {
            type: Boolean,
        },
        receipt: {
            type: String,
        },
        attempts: {
            type: String,
            required: true
        },
        paymentId: {
            type: String,
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("Payments", PaymentsSchema);
