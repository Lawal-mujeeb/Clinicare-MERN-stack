import express from "express";
import {
  register,
  login,
  authenticateUser,
  //logoutUser,
  refreshAccessToken,
  verifyUserAccount,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/userController.js";
import { validateFormData } from "../middlewares/validateForm.js";
import {
  validateSignUpSchema,
  validateSignInSchema,
  validateAccountSchema,
  forgotPasswordSchema,
  validateResetPasswordSchema,
} from "../utils/dataSchema.js";
import { verifyAuth } from "../middlewares/authenticate.js";
import { rateLimiter, refreshTokenLimit } from "../middlewares/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";

const router = express.Router();
// all form are post method, it here we are to specify the type of method and our endpoint name - before we can register we need to pass a middleware which is th validateFormData
router.post("/create", validateFormData(validateSignUpSchema), register); // when we do the /create we run the middleware validateFormData(validateSignUpSchema) before it goest to the register fucntion which is called by next
router.post(
  "/login",
  rateLimiter,
  validateFormData(validateSignInSchema),
  login
); // when we do the /login we run the middleware validateFormData(validateSignInSchema) before it goes to the login function which is called by next
router.get(
  "/user",
  verifyAuth,
  cacheMiddleware("auth_user, 3600"),
  authenticateUser
);
// router.post("/logout", verifyAuth, clearCache("auth_user"), logoutUser);
router.post("/refresh-token", refreshTokenLimit, refreshAccessToken);
//we trying to update a user that already exist , we use patch request but we use put when we want to update our entire document
router.patch(
  "/verify-account",
  rateLimiter,
  verifyAuth,
  validateFormData(validateAccountSchema),
  clearCache("auth_user"),
  verifyUserAccount
);
router.post(
  "/resend/verify-token",
  rateLimiter,
  verifyAuth,
  resendVerificationToken
);
//we are not using verify auth
router.post(
  "/forgot-password",
  rateLimiter,
  validateFormData(forgotPasswordSchema),
  forgotPassword
);

router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validateResetPasswordSchema),
  resetPassword
);
router.post("/logout", verifyAuth, clearCache("auth_user"), logout);
//its a post method because we sending back the cookie to the client side so it can be cleared, the reason why our cookies can e sent to the client is because we sent credentials to true and it saved bcs in our client side we set our withCredentials to true
export default router;
// note wecannot register our user if our form is not validated
