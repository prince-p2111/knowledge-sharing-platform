const express = require("express");
const route = express.Router();
const {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} = require("../controller/comment/comment.controller");

route.get("/get-comment", getComment);
route.post("/create-comment", createComment);
route.put("/update-comment/:id", updateComment);
route.delete("/delete-comment/:id", deleteComment);

module.exports = route;
