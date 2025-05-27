const express = require("express");
const route = express.Router();
const { login, signup, logout } = require("../controller/auth/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/login", login);
route.get("/logout", logout);
route.post("/signup", signup);
route.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user, // comes from authMiddleware
  });
});

module.exports = route;
