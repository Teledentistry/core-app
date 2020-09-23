const crypto = require("crypto");
const fetch = require("node-fetch");
const axios = require("axios");
// const { OAuth2Client } = require("google-auth-library");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    specialization,
    aboutMe,
    hospital,
  } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    specialization,
    aboutMe,
    hospital,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// const client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   /**
//    * To get access_token and refresh_token in server side,
//    * the data for redirect_uri should be postmessage.
//    * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
//    */
//   "postmessage"
// );

// exports.googleLogin = asyncHandler(async (req, res, next) => {
//   const code = req.body.code;

//   const profile = await getProfileInfo(code);

//   const { email_verified, name, email } = profile;

//   console.log("Email verified is :", email_verified);

//   if (email_verified) {
//     const user = await User.findOne({ email }).select("+password");

//     if (user) {
//       sendTokenResponse(user, 200, res);
//     } else {
//       let password = email + process.env.JWT_SECRET;

//       const user = await User.create({
//         name,
//         email,
//         password,
//       });

//       sendTokenResponse(user, 200, res);
//     }
//   } else {
//     return next(new ErrorResponse("Google login failed. Try again", 400));
//   }
// });

// const getProfileInfo = async (code) => {
//   const r = await client.getToken(code);
//   const idToken = r.tokens.id_token;

//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });

//   const payload = ticket.getPayload();

//   return payload;
// };

// @desc      Login and Register through facebook
// @route     POST /api/v1/auth/facebook-login
// @access    Public

// exports.facebookLogin = asyncHandler(async (req, res, next) => {
//   console.log("FACEBOOK LOGIN REQ BODY", req.body);
//   const { userID, accessToken } = req.body;

//   const url = `https://graph.facebook.com/v7.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;

//   const response = await axios.default.get(url);
//   console.log("RESPONSE DATA ====== ", response.data);
//   const { email, name } = response.data;

//   const user = await User.findOne({ email }).select("+password");

//   if (user) {
//     sendTokenResponse(user, 200, res);
//   } else {
//     let password = email + process.env.JWT_SECRET;

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     sendTokenResponse(user, 200, res);
//   }
// });
