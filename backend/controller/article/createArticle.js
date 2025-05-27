require("dotenv").config();
const db = require("../../models/index");
const Article = db.article;
const User = db.user;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

// Joi validation schema
const articleSchema = Joi.object({
  title: Joi.string().required().min(5).max(255).messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title should have at least 5 characters",
    "string.max": "Title should not exceed 255 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().required().min(50).messages({
    "string.empty": "Content cannot be empty",
    "string.min": "Content should have at least 100 characters",
    "any.required": "Content is required",
  }),
  tags: Joi.array().items(Joi.string()).optional(),
});

const createArticle = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = articleSchema.validate(req.body, {
      abortEarly: false, // Return all errors not just the first one
      allowUnknown: false, // Disallow unknown keys
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res
        .status(400)
        .json(generateErrorResponse("Validation error", errors));
    }
    console.log("value >> ", value.tags);

    // Get user ID from authenticated request (assuming you have auth middleware)
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(generateErrorResponse("User not found"));
    }
    console.log(value.tags);

    // Create article
    const article = await Article.create({
      title: value.title,
      content: value.content,
      tags: value.tags,
      created_by: userId,
    });

    // Include author information in response
    const responseData = {
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        tags: article.tags,
        created_at: article.created_at,
      },
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    return res
      .status(201)
      .json(
        generateResponse(true, "Article created successfully", responseData)
      );
  } catch (error) {
    console.error("Creating article API :", error);
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", error));
  }
};

module.exports = { createArticle };
