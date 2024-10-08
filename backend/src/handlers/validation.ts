import { check } from "express-validator";

//Validates the User input before register
export const validateRegister = [
  check("name", "Name is requiered")
    .isLength({ min: 4, max: 20 })
    .withMessage("Name must be between 4 and 20 characters!"),
  check("email").isEmail(),
];

//Validates the User input before login
export const validateLogin = [
  check("email").isEmail(),
];

