const express = require("express");
const router = express.Router();
const {
  register,
  signup,
  signin,
  signout,
  googleLogin,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

//Validation
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require("../validators/auth");

router.post("/register", userSignupValidator, runValidation, register);
router.post("/signup", signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

//Google
router.post("/google-login", googleLogin);

module.exports = router;
