const express = require("express");
const route = express.Router();
const {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} = require("../controller/comment/comment.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.get("/get-comment/:id", getComment);
route.post("/create-comment", authMiddleware, createComment);
route.put("/update-comment/:id", updateComment);
route.delete("/delete-comment/:id", deleteComment);

module.exports = route;
