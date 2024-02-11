import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import Users from "../../Models/Users";

/**
 * Interface defining custom properties added to the Express Request object.
 */
interface customRequest extends Request {
	user_id: string;
	_id: string;
	token: String;
	email: String;
	role: String;
	verified: Boolean;
}

/**
 * Joi schema for validating user signup data.
 */
const signupSchema = Joi.object({
	name: Joi.string().required().min(1),
	email: Joi.string().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

/**
 * Joi schema for validating user login data.
 */
const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

/**
 * Middleware for validating user signup data using the signupSchema.
 * Responds with an error if validation fails.
 */
const signupValidator = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const signupRequest = await signupSchema.validateAsync(req.body);
		next();
	} catch (err: any) {
		return res.status(err.status || 403).json({
			message: err.message || "An error occurred",
			success: false,
		});
	}
};

/**
 * Function to validate if an email already exists in the Users collection.
 * Returns true if the email exists, otherwise false.
 */
const validateEmail = async (email: String) => {
	const user = await Users.findOne({ email: email }).select("email");
	return user ? true : false;
};

/**
 * Function to validate if a username already exists in the Users collection.
 * Returns true if the username exists, otherwise false.
 */
const validateUsername = async (username: String) => {
	const user = await Users.findOne({ username: username }).select("username");
	return user ? true : false;
};

/**
 * Middleware for checking if a user is already verified.
 * Responds with an error if the user is already verified.
 */
const verification = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.verified) {
		return res.status(200).json({
			reason: "verified",
			message: "user already verified",
			success: false,
		});
	} else {
		next();
	}
};

/**
 * Middleware for checking if an OTP (One-Time Password) is provided in the request body.
 * Responds with an error if no OTP is provided.
 */
const isOTP = (req: customRequest, res: Response, next: NextFunction) => {
	if (req.body.otp) {
		next();
	} else {
		return res.status(200).json({
			reason: "no-OTP",
			message: "no OTP was provided! Enter OTP and try again!",
			success: false,
		});
	}
};

const passwordSchema = Joi.object({
	otp: Joi.string().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

const isAdmin = (req: customRequest, res: Response, next: NextFunction) => {
	if (req.role === "admin") {
		next();
	} else {
		return res.status(403).json({
			reason: "no-permission",
			message: "You need elevated permission to access this endpoint! If you think this is a mistake please contact the administrator!!",
			success: false
		})
	}
}


export default {
	signupValidator,
	validateEmail,
	validateUsername,
	loginSchema,
	verification,
	isOTP,
	passwordSchema,
	isAdmin,
};
