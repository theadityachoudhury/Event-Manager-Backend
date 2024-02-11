import { Schema, model } from "mongoose";

/**
 * Mongoose schema for the RefreshToken model, representing refresh tokens for user sessions.
 */
const CategorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the RefreshToken schema.
 */
export default model("Category", CategorySchema);
