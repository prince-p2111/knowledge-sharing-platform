const express = require("express");
const route = express.Router();
const {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} = require("../controller/article/article.controller");

route.get("/get-article", getArticles);
route.post("/create-article", createArticle);
route.put("/update-article/:id", updateArticle);
route.delete("/delete-article/:id", deleteArticle);

module.exports = route;
