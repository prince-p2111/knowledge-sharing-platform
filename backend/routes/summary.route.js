const express = require("express");
const route = express.Router();
const { createSummary } = require("../controller/summary/summary.controller");

route.get("/create-summary/:id", createSummary);

module.exports = route;
