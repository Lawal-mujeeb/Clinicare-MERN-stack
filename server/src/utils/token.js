import jwt from "jsonwebtoken";

export const signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
};
// another function to send token
export const createSendToken = (user) => {
  if (!user) return; // making sure we have a user
  const token = signToken(user._id); // this from mangodb id doc
  //create cookie to store our refreshToken to prevent js from seeing it on the client side i.e  inorder to prevent browser access on client
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, //cookie not accesible in js ,"Don't let JavaScript touch this cookie."
    secure: isProduction, //send cookie over HTTPS only when in prod env. In dev, we often use HTTP.
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie is valid for 7 mins
    // path: "/", //cookie is valid on all part across ur domain except we state it like /api/ahdhh bla bla blass
    path: "/api/v1/auth/refresh-token", //cookie is only valid on this path
    sameSite: isProduction ? "none" : "lax", //is required when the cookie bieng used on a different domains. we want to adjust the cross site request policy. Our app  is both client and server side which has different adress so  we want to ensure that in production mode, the cookie can be passed over a secure relay by setting the secure option to true(ensuring cookie is sent over https), but in dev mode we specifiy lax because we need to use it locally. if sameSite is set to none and secure is set to false, the browser will reject the cookie.
  };
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};


// In Summary:
// Your createSendToken() function does this:

// Makes sure there’s a valid user.

// Calls signToken() to generate access & refresh tokens.

// Builds cookie options to securely store the refresh token in a cookie.

// Returns everything the controller needs to:

// Set the cookie

// Send the access token in response

// Store refresh token safely from client-side access


