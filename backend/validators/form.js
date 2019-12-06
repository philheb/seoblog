const { check } = require("express-validator");

exports.contactFormValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Your name is required."),
  check("email")
    .isEmail()
    .withMessage("The email must be a valid email address."),
  check("message")
    .not()
    .isEmpty()
    .isLength({ min: 20 })
    .withMessage("The message must be at least 20 characters long.")
];
