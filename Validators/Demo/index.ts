import Joi from "joi";
const demoSchema = Joi.object({
    admissionReferenceNumber: Joi.string().required(),
    candidateName: Joi.string().required(),
    candidateCity: Joi.string().required(),
    candidateState: Joi.string().required(),
    candidatePinCode: Joi.number().required(),
    candidateAmountPaid: Joi.number().required(),
    candidateContactNumber: Joi.string().required(),
    candidateEmailId: Joi.string().email().required(),
    candidateDepartment: Joi.string().required(),
    candidateRelation: Joi.string().required(),
});

export default {
    demoSchema
}