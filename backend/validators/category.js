const { check } = require("express-validator");

exports.categoryCreateValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("The name of the category is required")
];
