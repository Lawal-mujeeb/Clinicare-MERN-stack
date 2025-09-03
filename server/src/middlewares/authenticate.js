import jwt from "jsonwebtoken";
import {promisify} from "util"; // use to await a promise from a callback
import User from "../models/user.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { forbiddenResponse, unauthorizedResponse } = responseHandler;

export const verifyAuth = tryCatchFn(async (req, res, next) => {
  //check if token exist
  let token;
  //checking for our token in the request header object and ensuring it starts with the  bearer signature word ensuring its jwt typentoken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1] //extracts the token without bearer
  }
  if (!token) {
    return next(
      unauthorizedResponse(
        "you are not logged in!, Please login to gain access"
      )
    );
  }
  //verify the token
  // promisify  use to await a promise from a callback
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  //check if a user exist with our decoded id  
  const currentUser = await User.findById(decoded.id);      //userId = decoded.id from the JWT check usercontroller line 25
  if (!currentUser) {
    return next(
      unauthorizedResponse("The user belonging to this token no longer exists.")
    );
  }
  //assign user to our req object
  req.user = currentUser;
  next()
});

//we want to write a middleware for role based auth
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        forbiddenResponse("You do not have permission to perform this action")
      );
    }
    next();
  };
};
//in the above code, we want to set rule that