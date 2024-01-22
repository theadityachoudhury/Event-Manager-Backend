import { Schema, model } from "mongoose";

/**
 * Mongoose schema for the RefreshToken model, representing refresh tokens for user sessions.
 */
const RefreshTokenSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

/**
 * Mongoose model for the RefreshToken schema.
 */
export default model("RefreshToken", RefreshTokenSchema);
