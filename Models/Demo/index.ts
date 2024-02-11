import mongoose from "mongoose";

/**
 * Mongoose schema for the Contact model, representing contact form submissions.
 */
const DemoSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        itemName: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("Demo", DemoSchema);
