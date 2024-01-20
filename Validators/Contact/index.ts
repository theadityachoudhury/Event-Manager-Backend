import Joi from 'joi';

const contactSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    name: Joi.string().min(1).required().messages({
        'string.min': 'Name is mandatory',
        'any.required': 'Name is required'
    }),
    message: Joi.string().min(30).required().messages({
        'string.min': 'Message length should be at least 30',
        'any.required': 'Message is required'
    })
});

export default contactSchema;