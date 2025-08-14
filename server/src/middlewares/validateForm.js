import { ZodError } from "zod";
//  this defines a middleware generator You pass in a Zod schema, and it returns a middleware function ((req, res, next)).
export const validateFormData = (schema) => (req, res, next) => {
  try {
    //receive and transform data gotten from client through req.body
    const parsedData = schema.parse(req.body);
    req.body = parsedData; //transform data with no error
    next(); // call the next action that is supposed to happen - invoke the api func
  } catch (error) {
    if (error instanceof ZodError) {
      //If the validation fails, Zod throws a ZodError.
      const errorMessages = error.issues.map((issue) => ({
        message: `${issue.path.join(".")} is ${issue.message}`, //all the message in the dataschema is going to be stored in the message here
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: errorMessages,
      });
    }
    next(error); // pass error to next handler
  }
};

// This function:

// Validates req.body using a Zod schema.

// If valid → saves cleaned data and calls next().

// If invalid → returns a 400 error with details, stopping the request flow.
