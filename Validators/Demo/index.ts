import Joi from "joi";
const demoSchema = Joi.object({
    itemName: Joi.string().required()
});

export default {
    demoSchema
}