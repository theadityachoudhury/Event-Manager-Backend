import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import AuthValidator from "../../Validators/Auth";
import Users from "../../Models/Users";
import { mailer } from "../../Utils";
import jsonwebtoken from "jsonwebtoken";
import Config from "../../Config";
import RefreshToken from "../../Models/RefreshToken";
import Auth from "../../Models/Auth";
import crypto from "crypto";

// Extract relevant configuration from the global Config object
const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET } = Config;

// Function to generate OTP with a specific length
const otpgen = (length: number) => {
	const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const digits = "0123456789";
	let otp = "";

	let alphabetCount = 0;
	let hasMinimumOneAlphabet = false;

	for (let i = 0; i < length; i++) {
		let randomIndex;

		if (
			(alphabetCount < 2 && Math.random() < 0.5) ||
			(i === length - 1 && !hasMinimumOneAlphabet)
		) {
			// If the current count of alphabets is less than 2 and random condition is met,
			// or if it is the last character and there has not been minimum one alphabet yet,
			// ensure the character is an alphabet.
			randomIndex = Math.floor(Math.random() * alphabets.length);
			otp += alphabets[randomIndex];
			alphabetCount++;
			hasMinimumOneAlphabet = true;
		} else {
			// Otherwise, add a random digit.
			randomIndex = Math.floor(Math.random() * digits.length);
			otp += digits[randomIndex];
		}
	}

	return otp;
};

function hashString(string: string) {
	const hash = crypto.createHash("sha256");
	hash.update(string);
	return hash.digest("hex");
};

// Define a custom request interface with additional properties
interface customRequest extends Request {
	user_id: string;
	_id: string;
	token: String;
	email: String;
	role: String;
	verified: Boolean;
}

// Define messages for login and registration
const Login_MSG = {
	usernameNotExist: "Email is not found. Invalid login credentials.",
	wrongRole: "Please make sure this is your identity.",
	loginSuccess: "You are successfully logged in.",
	wrongPassword: "Incorrect password.",
	loginError: "Oops! Something went wrong.",
};

const Register_MSG = {
	usernameExists: "Email is already taken.",
	emailExists: "Email is already registered.",
	signupSuccess: "You are successfully signed up.",
	signupError: "Unable to create your account.",
};

/**
 * Handles user registration.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (201) or failure (400, 500).
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (await AuthValidator.validateEmail(req.body.email)) {
			return res.status(400).json({
				message: Register_MSG.emailExists,
				success: false,
			});
		}


		const password = await bcrypt.hash(req.body.password, 12);
		const newUser = new Users({
			...req.body,
			password: password,
		});

		await newUser.save();
		res.status(201).json({
			message: Register_MSG.signupSuccess,
			success: true,
		});
		mailer(
			req.body.email,
			"Account Created || PG Search",
			`Your Account has been created in the Get-Me-Through portal.<br>To verify your account click on the link:- <a href="http://localhost:5173/verify" target="_blank">http://localhost:5173/verify</a>`,
			"acc_creation"
		);
		return;
	} catch (err: any) {
		console.log(err);
		let errMsg = Register_MSG.signupError;
		return res.status(err.status || 500).json({
			message: errMsg,
			success: false,
		});
	}
};

/**
 * Handles user login.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response containing user details and tokens.
 *                      Success (200) or failure (401, 404, 403, 500).
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const loginRequest = await AuthValidator.loginSchema.validateAsync(
			req.body
		);
		let user: any;
		let refreshTokenColl: any;
		user = await Users.findOne({ email: loginRequest.email });
		if (!user) {
			return res.status(404).json({
				reason: "email",
				message: Login_MSG.usernameNotExist,
				success: false,
			});
		}
		if (user.deleted) {
			return res.status(404).json({
				reason: "email",
				message: Login_MSG.usernameNotExist,
				success: false,
			});
		}
		refreshTokenColl = await RefreshToken.findOne({
			email: loginRequest.email,
		});
		let isMatch = await bcrypt.compare(loginRequest.password, user.password);
		if (isMatch) {
			let token = jsonwebtoken.sign(
				{
					user_id: user._id,
					role: user.role,
					email: user.email,
					verified: user.verified,
				},
				JWT_SECRET,
				{ expiresIn: "10m" }
			);

			let refreshToken = jsonwebtoken.sign(
				{
					user_id: user._id,
					role: user.role,
					email: user.email,
					verified: user.verified,
				},
				JWT_REFRESH_TOKEN_SECRET
			);

			if (!refreshTokenColl) {
				const newRefreshTokenColl = new RefreshToken({
					email: loginRequest.email,
					refreshToken,
				});
				newRefreshTokenColl.save();
			}
			if (refreshTokenColl) {
				RefreshToken.updateOne(
					{ email: user.email },
					{ $push: { refreshToken: refreshToken } }
				)
					.then((result: any) => {
						// console.log('Successfully updated the refresh token');
					})
					.catch((err: any) => {
						return res.status(406).json({
							reason: "email",
							message: "Unable to generate refresh token",
							success: false,
						});
						// console.error(err);
					});
			}
			res.cookie("token", token, {
				path: "/",
				expires: new Date(Date.now() + 1000 * 60 * 10),
				httpOnly: true,
				sameSite: "lax",
			});
			res.cookie("refreshToken", refreshToken, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
			});

			let backendTokens = {
				token: token,
				refreshToken: refreshToken,
				expiresIn: new Date().setTime(new Date().getTime() + 10 * 60 * 1000)
			};

			return res.status(200).json({
				backendTokens,
				user,
				message: Login_MSG.loginSuccess,
				success: true,
			});
		} else {
			return res.status(401).json({
				reason: "password",
				message: Login_MSG.wrongPassword,
				success: false,
			});
		}
	} catch (e: any) {
		// console.log(e);
		let errorMsg = Login_MSG.loginError;
		if (e.isJoi === true) {
			e.status = 403;
			errorMsg = e.message;
		}
		return res.status(e.status || 500).json({
			reason: "server",
			message: errorMsg,
			success: false,
		});
	}
};

/**
 * Retrieves user details.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response containing user details.
 *                      Success (200) or no content (204) if user not found.
 */
const getuser = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	let user;
	if (req._id) {
		const userid = req._id;
		try {
			user = await Users.findById(userid, "-password");
		} catch (err: any) {
			return new Error(err);
		}
	} else if (req.email) {
		const email = req.body.email;
		try {
			user = await Users.findOne({ email: email });
		} catch (err: any) {
			return new Error(err);
		}
	}
	if (!user) {
		return res.status(200).json(null);
	}
	let r: Object;
	if (req.token) {
		let token = req.token;
		r = {
			token,
			user,
		};
	} else {
		r = user;
	}
	return res.status(200).json({ data: user });
};

/**
 * Middleware to verify JWT token.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (403).
 */
const verifytoken = (req: customRequest, res: Response, next: NextFunction) => {
	let token: any;

	if (req.cookies && (req.cookies.token || req.cookies.accessToken)) {
		token = req.cookies.token || req.cookies.accessToken;
	} else if (req.headers['authorization']) {
		const authHeader = req.headers['authorization'];
		const bearerTokenMatch = authHeader && authHeader.match(/^Bearer (.+)$/);

		if (bearerTokenMatch) {
			token = bearerTokenMatch[1];
		}
	}
	if (!token) {
		return res.status(200).json(null);
	}

	jsonwebtoken.verify(String(token), JWT_SECRET, (err: any, user: any) => {
		if (err) {
			return res.status(200).json(null);
		} else {
			req._id = user.user_id;
			req.token = token;
			req.email = user.email;
			req.role = user.role;
			req.verified = user.verified;
			next();
		}
	});
};

/**
 * Refreshes JWT token.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response containing new tokens.
 *                      Success (200) or failure (403).
 */
const refresh = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	let refreshTokenColl;
	var email = req.email;
	// console.log(username);
	refreshTokenColl = await RefreshToken.findOne({ email });
	const user = await Users.findById(req._id);

	if (!refreshTokenColl) {
		return res.status(200).json(null);
	} else {
		let token = jsonwebtoken.sign(
			{
				user_id: user?._id,
				email: user?.email,
				role: user?.role,
				verified: user?.verified,
			},
			JWT_SECRET,
			{ expiresIn: "10m" }
		);
		res.cookie("token", token, {
			path: "/",
			expires: new Date(Date.now() + 1000 * 60 * 10),
			httpOnly: true,
			sameSite: "lax",
		});
		return res.status(200).json({
			token,
			refreshToken: req.token,
			expiresIn: new Date().setTime(new Date().getTime() + 10 * 1000)

		});
	}
};

/**
 * Middleware to verify refresh token.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (403).
 */
const verifyRefreshToken = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	let token: any;

	if (req.cookies && (req.cookies.refreshToken || req.cookies.refreshAccessToken)) {
		token = req.cookies.refreshToken || req.cookies.refreshAccessToken;
	} else if (req.headers['authorization']) {
		const authHeader = req.headers['authorization'];
		const bearerTokenMatch = authHeader && authHeader.match(/^Refresh (.+)$/);

		if (bearerTokenMatch) {
			token = bearerTokenMatch[1];
		}
	}
	if (!token) {
		return res.status(200).json(null);
	}

	if (!token) {
		return res.status(200).json(null);
	}

	// console.log(token);

	jsonwebtoken.verify(
		String(token),
		JWT_REFRESH_TOKEN_SECRET,
		(err: any, user: any) => {
			if (err) {
				// console.log(err);
				return res.status(200).json(null);
			} else {
				req._id = user.user_id;
				req.email = user.email;
				req.role = user.role;
				req.verified = user.verified;
				req.token = token;
				next();
			}
		}
	);
};

/**
 * Updates user verification status.
 * 
 * @param email - User email.
 * @param verified - Verification status.
 */
const verifyUser = async (email: any, verified: boolean) => {
	let user = await Users.findOne({ email });
	if (user) {
		user.verified = verified;
		await user.save();
	}
};

/**
 * Handles account verification.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (401, 403, 500).
 */
const verify = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	const auth_type = "acc_verify";
	const { otp } = req.body;
	const email = req.email;
	if (await AuthValidator.validateEmail(email)) {
		let auth = await Auth.findOne({ email, auth_type: auth_type });
		if (auth) {
			if (auth.otp === otp) {
				verifyUser(email, true);
				await Auth.findByIdAndDelete(auth._id);
				// console.log(req._id);
				res.clearCookie(req._id);
				return res.status(200).json({
					message: "Account verified successfully",
					success: true,
				});
			} else {
				return res.status(401).json({
					reason: "otp",
					message: "OTP is wrong",
					success: false,
				});
			}
		} else {
			return res.status(403).json({
				reason: "otp",
				message: "First generate otp then try verifying the account!",
				success: false,
			});
		}
	}
};

/**
 * Handles user logout.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (403).
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
	const { refreshToken, refreshAccessToken } = req.cookies;
	const token = refreshToken || refreshAccessToken;

	res.clearCookie("token");
	res.clearCookie("refreshToken");

	if (!token) {
		return res.status(200).json(null);
	}

	// if (!token) {
	// 	return res.status(200).json({
	// 		reason: "unauthorized",
	// 		message: "token not found",
	// 		success: false,
	// 	});
	// }

	jsonwebtoken.verify(token, JWT_SECRET, (err: any, user: any) => {
		if (err) {
			return res.status(200).json(null);
		} else {
			RefreshToken.findOne({ refreshToken: refreshToken })
				.then((foundToken: any) => {
					// console.log(foundToken);
					if (!foundToken) {
						throw new Error("Invalid refreshToken");
					}

					// console.log("the email is :- " + user.username);

					return RefreshToken.updateOne(
						{ email: user.email },
						{ $pull: { refreshToken: refreshToken } }
					);
				})
				.then((result: any) => {
					if (result.nModified === 0) {
						throw new Error("Failed to remove refreshToken");
					}

					// console.log("Successfully removed the refreshToken from the array");
					return res.status(200).json(null);
				})
				.catch((err: any) => {
					console.error(err.message);
					return res.status(200).json(null);
				});
		}
	});
};

/**
 * Generates and sends OTP for account verification.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (403, 500).
 */
const generate = async (
	req: customRequest,
	res: Response,
	next: NextFunction
) => {
	const otp_len = 6;
	const auth_type = "acc_verify";
	let otp;
	const email = req.email;

	let auth;
	try {
		auth = await Auth.findOne({ email, auth_type: auth_type });
	} catch (err) {
		return res.status(500).json({
			reason: "error",
			message: "Internal Server Error! Cannot generate OTP!",
			success: false,
		});
	}
	if (auth) {
		otp = auth.otp;
	} else {
		otp = otpgen(otp_len);
		auth = new Auth({
			email,
			auth_type,
			otp,
		});

		try {
			await auth.save();
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				reason: "error",
				message: "Internal Server Error! Cannot generate OTP!",
				success: false,
			});
		}
	}

	try {
		mailer(
			email,
			"Account Verification OTP | Get-Me-Through",
			`Your account verification OTP is :- ${otp}`,
			auth_type
		);
	} catch (e) {
		return res.status(500).json({
			reason: "error",
			message: "Internal Server Error! Unable to send E-Mail!! Mailer Error",
			success: false,
		});
	}

	return res.status(200).json({
		otp: otp,
		message: "OTP generated successfully and sent to registered E-Mail",
		success: true,
	});
};

/**
 * Handles face verification.
 * 
 * @param req - Custom request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns {Response} - JSON response indicating success (200) or failure (400, 500).
 */
const faceVerified = async (req: customRequest, res: Response, next: NextFunction) => {
	const email = req.email;
	try {
		const user = await Users.findOne({ email: email });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		user.face = true;
		user.save();
		return res.status(200).json();

	} catch (err: any) {
		return res.status(500).json("Internal Server Error!!");
	}
}

/**
 * 
 * @param req - Request Objects
 * @argument email - Gets email address to generate a unique link for password reset
 * @param res - Express response object
 * @param next - Express next function.
 * @returns 
 */
const forget = async (req: Request, res: Response, next: NextFunction) => {
	const auth_type = "pass_reset";
	const { email } = req.body;
	const user = await Users.findOne({ email: email });
	if (!user) {
		return res.status(404).json({
			reason: "email",
			message: "Account associated with this E-Mail Id not found!!",
			success: false,
		});
	}

	let auth = await Auth.findOne({ email: email, auth_type: auth_type });
	const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
	const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
	const stringToHash = currentDate + email + salt;
	const otp = hashString(stringToHash);
	if (auth) {
		auth.otp = otp;
	} else {
		auth = new Auth({
			email,
			auth_type,
			otp,
		});
	}
	await auth.save();
	mailer(
		email,
		"Password Reset Link | Get-Me-Through",
		`To reset your password click this link:- <a href=${Config.ORIGIN}/forget/${otp} target="_blank">${Config.ORIGIN}/forget/${otp}</a>`,
		auth_type
	);
	return res.status(200).json({
		message: "Password Reset Link Sent to the E-Mail ID",
		success: true,
	});
};

const forgetIsValid = async (req: Request, res: Response, next: NextFunction) => {
	const auth_type = "pass_reset";
	const { otp } = req.params;
	try {
		const auth = await Auth.findOne({ otp: otp, auth_type: auth_type });
		return auth ? res.status(200).json() : res.status(404).json();
	} catch (err) {
		return res.status(500).json();
	}
};

const forget_save = async (req: Request, res: Response, next: NextFunction) => {
	const auth_type = "pass_reset";
	const { password, otp } = req.body;
	try {
		const resetRequest = await AuthValidator.passwordSchema.validateAsync(req.body);

		const auth = await Auth.findOne({ otp: otp, auth_type: auth_type });

		if (!auth) {
			return res.status(404).json();
		}

		const user = await Users.findOne({
			email: auth.email
		})

		if (!user) {
			return res.status(404).json()
		}

		user.password = await bcrypt.hash(password, 12);
		await user.save();
		await Auth.findByIdAndDelete(auth._id);
		return res.json();
	} catch (err) {
		console.log(err);
		return res.status(400).json("Please try again with password with minimum 8 characters!!");
	}
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await Users.find().select("-password");
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json();
	}
};

export default {
	signup,
	login,
	getuser,
	verifytoken,
	verifyRefreshToken,
	refresh,
	verify,
	logout,
	generate,
	faceVerified,
	forget,
	forgetIsValid,
	forget_save,
	getAllUsers
};
