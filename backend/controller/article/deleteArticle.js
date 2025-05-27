require("dotenv").config();
const db = require("../../models/index");
const Article = db.article;
const User = db.user;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const deleteArticle = async (req, res) => {
  try {
    // Validate article ID parameter
    const { error: paramError } = Joi.number()
      .integer()
      .positive()
      .required()
      .validate(req.params.id, {
        abortEarly: false,
        convert: false,
      });

    if (paramError) {
      return res.status(400).json(generateErrorResponse("Invalid article ID"));
    }

    const articleId = req.params.id;
    const userId = req.user.id; // Assuming user is authenticated

    // Find the article with the author information
    const article = await Article.findOne({
      where: { id: articleId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!article) {
      return res.status(404).json(generateErrorResponse("Article not found"));
    }

    // Check if the requesting user is the author or an admin
    if (article.created_by !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json(
          generateErrorResponse("You are not authorized to delete this article")
        );
    }

    // Soft delete the article (since paranoid is enabled)
    await article.destroy();

    // Prepare response data
    const responseData = {
      id: article.id,
      title: article.title,
      message: "Article deleted successfully",
      deleted_at: new Date().toISOString(),
      author: {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
      },
    };

    return res
      .status(200)
      .json(
        generateResponse(true, "Article deleted successfully", responseData)
      );
  } catch (error) {
    console.error("Deleting article API :", error);
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", error));
  }
};

module.exports = { deleteArticle };
