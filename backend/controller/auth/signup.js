require("dotenv").config();
const db = require("../../models/index");
const user = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json(generateErrorResponse("All fields are required"));
    }

    const userData = await user.findOne({ where: { email } });

    if (userData) {
      return res
        .status(400)
        .json(generateErrorResponse("User already exists with this email"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name: name,
      email,
      password: hashedPassword,
      role: role,
    });

    return res.status(200).json(
      generateResponse(true, "User created successfully", {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      })
    );
  } catch (error) {
    console.log("Sign up API :", error);
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", error));
  }
};
module.exports = { signup };
