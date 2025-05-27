const express = require("express");
const route = express.Router();
const { login, signup } = require("../controller/auth/auth.controller");

route.post("/login", login);
route.post("/signup", signup);

module.exports = route;
