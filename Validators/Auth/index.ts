import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import Users from "../../Models/Users";

interface customRequest extends Request {
	user_id: string;
	_id: string;
	token: String;
	email: String;
	role: String;
	verified: Boolean;
}

const signupSchema = Joi.object({
	name: Joi.string().required().min(1),
	email: Joi.string().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

const loginSchema = Joi.object({
	// name: Joi.string().required().min(1),
	// email: Joi.string().email().required(),
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

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

const validateEmail = async (email: String) => {
	const user = await Users.findOne({ email: email }).select("email");
	return user ? true : false;
};

const validateUsername = async (username: String) => {
	const user = await Users.findOne({ username: username }).select("username");
	return user ? true : false;
};

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
const isOTP = (req: customRequest, res: Response, next: NextFunction) => {
	if (req.body.otp) {
		next();
	} else {
		return res.status(200).json({
			reason: "no-OTP",
			message: "no OTP was provided! Enter otp and try again!",
			success: false,
		});
	}
};

export default {
	signupValidator,
	validateEmail,
	validateUsername,
	loginSchema,
	verification,
	isOTP,
};
