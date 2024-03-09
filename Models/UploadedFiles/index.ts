import { Schema, model } from "mongoose";

/**
 * Mongoose schema for the UploadedFiles model, representing uploaded files for profile pictures or event related pictures.
 */
const UploadedFilesSchema = new Schema(
    {
        owner: {
            type: Schema.ObjectId,
            ref: "Users",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        isEvent: {
            type: Boolean,
            required: true,
            default: false
        },
        eventId: {
            type: Schema.ObjectId,
            ref: "Events",
        },
        isEventPoster: {
            type: Boolean,
            required: true,
            default: false
        },
        isUserProfile: {
            type: Boolean,
            required: true,
            default: false
        },
        isEventPicture: {
            type: Boolean,
            required: true,
            default: false
        },
        location: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the UploadedFiles schema.
 */
export default model("UploadedFiles", UploadedFilesSchema);
