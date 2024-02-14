import { boolean, required } from "joi";
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
        paid: {
            type: Boolean,
            default: false
        },
        paymentMethod: {
            type: String,
        },
        referenceNumber: {
            type: String
        },
        currency: {
            type: String
        },
        international: {
            type: boolean,
            required: true
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("Payments", PaymentsSchema);
