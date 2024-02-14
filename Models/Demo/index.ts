import mongoose from "mongoose";

/**
 * Mongoose schema for the Contact model, representing contact form submissions.
 */
const DemoSchema = new mongoose.Schema(
    {
        admissionReferenceNumber: {
            type: String,
            required: true
        },
        canditateName: {
            type: String,
            required: true
        },
        candidateCity: {
            type: String,
            required: true
        },
        candidateState: {
            type: String,
            required: true
        },
        candidatePinCode: {
            type: Number,
            required: true
        },
        candidateAmountPaid: {
            type: Number,
            required: true
        },
        candidateContactNumber: {
            type: String,
            required: true
        },
        candidateEmailId: {
            type: String,
            requierd: true
        },
        candidateDepartment: {
            type: String,
            required: true
        },
        candidateRelation: {
            type: String,
            required: true
        },
        employeeId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Users"
        }
    },
    { timestamps: true }
);

/**
 * Mongoose model for the Contact schema.
 */
export default mongoose.model("Demo", DemoSchema);
