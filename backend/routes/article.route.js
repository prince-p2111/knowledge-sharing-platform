const express = require("express");
const route = express.Router();
const {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} = require("../controller/article/article.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.get("/get-article", getArticles);
route.post("/create-article", authMiddleware, createArticle);
route.put("/update-article/:id", authMiddleware, updateArticle);
route.delete("/delete-article/:id", authMiddleware, deleteArticle);

module.exports = route;
