import express from "express";
import Auth from "../../Controllers/Auth";
import AuthValidator from "../../Validators/Auth";
import s3 from "../../Controllers/s3";

const router = express.Router();

/**
 * Route for user signup.
 * Validates signup data using AuthValidator.signupValidator middleware.
 * Calls Auth.signup controller to handle the signup process.
 */
router.post("/signup", AuthValidator.signupValidator, Auth.signup);

/**
 * Route for user login.
 * Calls Auth.login controller to handle the login process.
 */
router.post("/login", Auth.login);

/**
 * Route for getting user information.
 * Requires token verification using Auth.verifytoken middleware.
 * Calls Auth.getuser controller to retrieve user information.
 */
router.get("/user", Auth.verifytoken as any, Auth.getuser as any);

/**
 * Route for refreshing access token.
 * Requires refresh token verification using Auth.verifyRefreshToken middleware.
 * Calls Auth.refresh controller to generate a new access token.
 */
router.get("/refresh", Auth.verifyRefreshToken as any, Auth.refresh as any);

/**
 * Route for user logout.
 * Calls Auth.logout controller to handle the logout process.
 */
router.post("/logout", Auth.logout);

/**
 * Route for verifying user account.
 * Requires token verification using Auth.verifytoken middleware.
 * Validates user verification using AuthValidator.verification and AuthValidator.isOTP middlewares.
 * Calls Auth.verify controller to handle the verification process.
 */
router.post(
    "/verify",
    Auth.verifytoken as any,
    AuthValidator.verification as any,
    AuthValidator.isOTP as any,
    Auth.verify as any
);

/**
 * Route for generating OTP for user account.
 * Requires token verification using Auth.verifytoken middleware.
 * Validates user verification using AuthValidator.verification middleware.
 * Calls Auth.generate controller to handle the OTP generation process.
 */
router.post(
    "/generate",
    Auth.verifytoken as any,
    AuthValidator.verification as any,
    Auth.generate as any
);

/**
 * Route for adding a face image.
 * Requires token verification using Auth.verifytoken middleware.
 * Calls s3.faceAdd controller to handle the face image addition process.
 */
router.post("/face-add", Auth.verifytoken as any, s3.faceAdd);

/**
 * Route for getting face images.
 * Calls s3.faceGet controller to retrieve face images.
 */
router.get("/face-get", s3.faceGet);

/**
 * Route for verifying face image.
 * Requires token verification using Auth.verifytoken middleware.
 * Calls Auth.faceVerified controller to handle the face image verification process.
 */
router.get("/face-verified", Auth.verifytoken as any, Auth.faceVerified as any);

export default router;
