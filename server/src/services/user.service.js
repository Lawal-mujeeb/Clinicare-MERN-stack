import crypto from "crypto"; //we want to use crypto to help us generate numbers randomly Comes from Node.js's built-in crypto module.
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import mailService from "./email.service.js";
import responseHandler from "../utils/responseHandler.js";
import jwt from "jsonwebtoken"; //importing jwt to help us generate our token
import { authenticateUser } from "../controllers/userController.js";
const { errorResponse, notFoundResponse } = responseHandler;

// the full name email and sort we are calling it a parameter called userData and the next is going to call the error response or not foundresponse either one
const userService = {
  register: async (userData, next) => {
    //check if email already exist , it is going to check the email in the database againsnst the email in the userdata form
    const emailExist = await User.findOne({ email: userData.email });
    if (emailExist) {
      return next(errorResponse("Email already exist", 400)); //next is the messanger calls back our error response
    }
    //if fresh new UserData (email) , we can proceed to creating our user
    //handle verification code to be sent to our user email
    const verificationCode = crypto.randomInt(100000, 999999).toString(); //six characters randomly generated
    //we want to use crypto to help us generate numbers with the first represent minimum while the second is max
    const verificationCodeExpiry = new Date(Date.now() + 3600000); // 1hr expiry
    //handle password encryption note we need to encrypt ur password and how do we encrypt, we need another package called bcrypt
    const salt = await bcrypt.genSalt(10); //degree of encryption
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    //proceed to create our user
    const user = await User.create({
      ...userData, //this includes all user data
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
      //anthing we dont want to send to our database , we dont include it here
    });
    //proceed to sending email to the user
    // we are going to use the process from node as the process.nextTick- this is allow us to not block synchronous operations - the api response wont wait for the email to be sent, even if the email fails it wont affect the creation of the user
    process.nextTick(() => {
      mailService.sendWelcomeEmail(user).catch(console.error); // catch mail sending error
    });
    //if user could not be registered , then we send server error
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user; // send user to our controller
  },
  //login user
  login: async (userData, next) => {
    //find user with email from the form also .. password
    const user = await User.findOne({ email: userData.email }).select(
      "+password"
    ); //select includes the field we want to  have access to , in this case the password
    if (!user) {
      return next(errorResponse("Account not found", 401));
    }
    //handle password we are going to use bcrypt to compare the password from the form with the passoword in the database
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      user.password
    ); //userData.password is from the form, while user.password is the password saved about the user in the database
    if (!isPasswordCorrect) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    return user; // return user to our controller so we can use it in our controller
  },

  authenticateUser: async (userId, next) => {
    //get userId from our jwt decoded token
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user; //return user to our controller
  },

  // logoutUser: async (req, res, next) => {
  //   //reset the cookie maxAge value
  //   res.cookie("userRefreshToken", "", {
  //     maxAge: 0, // if we logout we want to reset the cookie
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //     path: "/",
  //   });
  //   return true;
  // },
  //get a new accessToken when the current one expires
  refreshAccessToken: async (refreshToken, next) => {
    if (!refreshToken) {
      return next(errorResponse("Refresh token is required", 401));
    }
    //verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(errorResponse(" Invalid refresh token ", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user; // return user to our controller to generate new access token
  },
  // we want to verify the user account using the verification token and userid
  verifyUserAccount: async (data, next) => {
    //destructure data
    const { userId, verificationToken } = data;
    // find our user, and get the  verificationToken/expiry saved to the user
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    ); //just like the we did in password, we want to  pull the verificationToken and verificationTokenExpiry from the database
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    //check if the user is already verified
    if (user.isVerified) {
      return next(errorResponse(" Account is already verified ", 400));
    }
    //check if the verificationCode saved in the db is the same as the one recieved from the form
    if (user.verificationToken !== verificationToken) {
      return next(errorResponse(" Invalid verification token ", 400));
    }
    //check for token expiry
    if (user.verificationTokenExpiry < new Date()) {
      user.verificationToken = undefined; // reset the verification token
      user.verificationTokenExpiry = undefined; // reset the verification token expiry
      await user.save();
      return next(
        errorResponse(
          "verification token has expired, please get a new one ",
          400
        )
      );
    }
    // verify user if token has not expired
    user.isVerified = true; // set the user as verified
    user.verificationToken = undefined; // reset the verification Token
    user.verificationTokenExpiry = undefined; // reset the verification Token expiry
    await user.save();
    return user; //return user to our controller
  },
// Why verificationToken & verificationTokenExpiry become undefined after verification:
// In the code, these fields are explicitly reset to undefined both when the token is expired and when verification succeeds.
// This is done to prevent token reuse and because verification is a one-time process — there’s no need to keep the token after the account is verified.
// If a user is already verified, these fields will remain undefined because they were cleared at the time of the first successful verification.
// Key point:
// Clearing tokens after verification is a security best practice. Only keep them if you have a specific reason (e.g., audit logging)
// You don’t want a verified account to still have a valid verification token in the database because:
// That token could be reused by mistake or maliciously.
// The verification process is one-time — after success, there’s no reason to keep the token.

  resendVerificationToken: async (userId, next) => {
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.isVerified) {
      return next(errorResponse(" Account is already verified "));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000); // 1hr
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationCodeExpiry;
    await user.save();
    //send verification email to the user
    process.nextTick(() => {
      mailService.sendVerificationCode(user).catch(async (error) => {
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send verification code", error);
      });
    });
    return user;
  },
  forgotPassword: async (userData, next)=> {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    //generate reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 900000); // 15 minutes
    user.passwordResetToken = resetCode;
    user.passwordResetTokenExpiry = resetCodeExpiry;
    await user.save();
    //send  password reset  email to the user
    process.nextTick(() => {
      mailService.sendPasswordResetEmail(user).catch(async (error) => {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send password token", error);
      });
    })
    return user;
  },
  resetPassword: async (userData, next) => {
    const { email, password, confirmPassword, passwordResetToken } = userData;
    if (password !== confirmPassword) {
      return next(errorResponse("Passwords do not match", 400));
    }
    const user = await User.findOne({ email }).select(
      "+password +passwordResetToken +passwordResetTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found with that email"));
    }
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetToken
    ) {
      return next(errorResponse("Password reset token not found", 400));
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    if (user.passwordResetTokenExpiry < new Date()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Password reset token has expired", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return user;
  },
  //we want to logout so we simply remove the cookie// our access token is called in state memory
  logout: async (req, res, next) => {
    res.cookie("userRefreshToken", "", {
      maxAge: 0,
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token", // the refreshtoken is the master key that why er clear it when we logout
    }); //for clearing the cookie during logout, bcs our cookie contains our refresh token, we don't want to make our cookie to be seen every where only on the specified path
    return true;
  },

};

export default userService;
