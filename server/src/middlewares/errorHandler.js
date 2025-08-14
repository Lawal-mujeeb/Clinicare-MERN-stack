//error handler for our backend application
import responseHandler from "../utils/responseHandler.js";
const { errorResponse } = responseHandler;

// error handler for dev enviroment ( development mode is when we code and production mode is when we host)

const sendErrorDev = (err, res) => {
  const errResponse = {
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: {
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    },
  };
  console.error("ERROR", err);
  res.status(err.statusCode || 500).json(errResponse);
};

//send error  for prod enviroment
const sendErrorProd = (err, res) => {
  // if operation is set to true, then we send a msg to client
  if (err.isOperational) {
    const errResponse = {
      status: err.status || "error",
      message: err.message,
    };
    return res.status(err.statusCode || 500).json(errResponse);
  }
  //programming errors or unkonwn errors: dont leak error to client
  console.error("ERROR", err);
  return res.status(err.statusCode).json({
    status: "error",
    message: "Something went wrong",
  });
};

//handle jwt error jason web tokens
const handleJWTError = () => {
  return errorResponse("Invalid token. please log in again", 401);
};

const handleJWTExpiredError = () => {
  return errorResponse("your token has expired!. please login again", 401);
};

// main error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message, name: err.name };
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

//catch 404 error routes
export const CatchNotFound = (req, res) => {
  errorResponse(`Cant find ${req.originalUrl} on this server !`, 404);
};
