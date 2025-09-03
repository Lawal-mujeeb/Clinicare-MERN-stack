import crypto from "crypto"; //we want to use crypto to help us generate numbers randomly Comes from Node.js's built-in crypto module.
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import Inpatient from "../models/inpatient.js";
import mailService from "./email.service.js";
import responseHandler from "../utils/responseHandler.js";
import jwt from "jsonwebtoken"; //importing jwt to help us generate our token
import { authenticateUser } from "../controllers/userController.js";
const { errorResponse, notFoundResponse } = responseHandler;

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

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
  forgotPassword: async (userData, next) => {
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
    });
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token", // the refreshtoken is the master key that why er clear it when we logout
    }); //for clearing the cookie during logout, bcs our cookie contains our refresh token, we don't want to make our cookie to be seen every where only on the specified path
    return true;
  },
  uploadAvatar: async (userId, avatar, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (!avatar) {
      return next(errorResponse("No file uploaded", 400));
    }
    //check if user has avatar already
    const currentAvatar = user.avatar;
    const currentAvatarId = user.avatarId;
    if (currentAvatar) {
      //if avatar exists, delete and replace with new avatar
      await deleteFromCloudinary(currentAvatarId);
    }
    //Cloudinary returns: url → the link to the uploaded image,public_id → the unique Cloudinary ID (used for future delete/updates)
    const { url, public_id } = await uploadToCloudinary(avatar, {
      folder: "Clinicare/avatars",
      width: 200,
      height: 200,
      crop: "fit",
      format: "webp",
    });
    //Updates the user’s avatar (image URL) and avatarId (Cloudinary ID).
    user.avatar = url || user.avatar;
    user.avatarId = public_id || user.avatarId;
    await user.save();
    return user;
  },
  updateUserPassword: async (userId, userData, next) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    const { password, newPassword, confirmPassword } = userData;
    const [checkPassword, isPasswordSame] = await Promise.all([
      bcrypt.compare(password, user.password),
      bcrypt.compare(newPassword, user.password),
    ]);
    if (!checkPassword) {
      return next(errorResponse("Incorrect current password", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(
        errorResponse("New password and confirm password does not match", 400)
      );
    }
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    return updatedUser;
  },
  updateUser: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (userData.phone) {
      const phoneExists = await User.findOne({ phone: userData.phone });
      if (phoneExists) {
        return next(errorResponse("Phone number already exists", 400));
      }
    }
    //we are mapping over it instead of doing the normal method
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  deleteAccount: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }
    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId });
      const inpatient = await Inpatient.findOne({ patientId: patient });
      if (inpatient) {
        await inpatient.deleteOne();
      }
      await Patient.findOneAndDelete({ userId });
    }
    if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ userId });
    }
    await user.deleteOne();
    return true;
  },
  //page = which “slice” of users you want. limit = how many users per slice.
  //limit → how many users per page (default 3).  //limit = 3 → each page shows 3 users. page = 1 → you get users 1–3. page = 2 → you get users 4–6.
  //page = 3 → you get users 7–9.
  getAllUsers: async (page = 1, limit = 3, query = "", role = "", next) => {
    const sanitizeQuery = //
      query || role //If query or role is given
        ? (query || role).toLowerCase().replace(/[^\w\s]/gi, "") // default to lowercase, Removes special characters (regex [^\w\s] means: "anything that is not a word or whitespace"). so this prevent This prevents funky input like "Admin!!***" from breaking your regex.
        : "";
    const [users, total] = sanitizeQuery
      ? //[ /* search mode */ ]
        await Promise.all([
          User.find({
            $or: [
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
          })
            .sort({ createdAt: -1 }) //Sort newest first.
            .skip((page - 1) * limit) //Apply pagination (skip, limit). Page 1 → start at record 0.Page 2 → start at record 3.Page 3 → start at record 6.
            .limit(limit),
          // At the same time, it counts how many total users match that search:
          User.countDocuments({
            //the count is going to look for the result
            $or: [
              // or is telling us look for the user either in full name or role which we make refrence in our user or patient model
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
          }),
        ])
      : // [ /* no search, just list or fetch all users: */ ]
        // It just returns all users, newest first, paginated. And counts all the users in the collection.
        await Promise.all([
          User.find()
            .sort({ createdAt: -1 }) //sort by newest
            .skip((page - 1) * limit) //apply pagination
            .limit(limit),
          User.countDocuments(),
        ]);
    if (!users) {
      return next(notFoundResponse("No users found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit), //computed from total / limit.
        total, // total number of matching users found
        hasMore: (page - 1) * limit + users.length < total, //true if there are more users beyond this page.
        limit,
      },
      users,
    };
    //So in plain words:If you search → it filters users by name or role.If you don’t search → it just gives you everyone.Either way → you get a list of users + a count of how many exist
  },
  deleteAccountAdmins: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }
    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId });
      const inpatient = await Inpatient.findOne({ patientId: patient });
      if (inpatient) {
        await inpatient.deleteOne();
      }
      await Patient.findOneAndDelete({ userId });
    }
    if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ userId });
    }
    await user.deleteOne();
    return true;
  },
  updateUserRole: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found"));
    }
    if (user.role === "patient") {
      return next(errorResponse("patient role cannot be updated "));
    }
    if (user.role === "admin" && userData.role !== "admin") {
      return next(errorResponse("Admin cannot update or downgrade an admin"));
    }
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  createUserAdmins: async (userData, next) => {
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exists", 400));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(userData.password, salt);
    const user = await User.create({
      ...userData,
      password: hashedPass,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
    });
    process.nextTick(() => {
      mailService
        .sendWelcomeEmail(user, userData.password)
        .catch(console.error);
    });
    if (user.role === "doctor") {
      await Doctor.create({
        userId: user._id,
        availability: userData.availability,
        specialization: userData.specialization,
      });
    }
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user;
  },
};

export default userService;
