require("dotenv").config();
const db = require("../../models/index");
const user = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(generateErrorResponse("Email and password are required"));
    }

    const userData = await user.findOne({ where: { email } });

    if (!userData) {
      return res.status(404).json(generateErrorResponse("User not found"));
    }

    // Compare hashed passwords
    const isValid = await bcrypt.compare(password, userData?.password);
    if (!isValid) {
      return res.status(401).json(generateErrorResponse("Invalid password"));
    }

    const token = jwt.sign(
      {
        id: userData?.id,
        name: userData?.name,
        email: userData?.email,
        role: userData?.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Save the token in the database
    await user.update({ token: token }, { where: { id: userData?.id } });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Secure only in production
      expires: new Date(Date.now() + 60 * 60 * 1000),
      sameSite: "strict", // Helps with cross-site security
    });

    return res.status(200).json(
      generateResponse(true, `Welcome back, ${userData?.name || "User"}!`, {
        id: userData?.id,
        name: userData?.name,
        email: userData?.email,
        role: userData?.role,
      })
    );
  } catch (error) {
    console.log("Login API :", error);
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", error));
  }
};
module.exports = { login };
