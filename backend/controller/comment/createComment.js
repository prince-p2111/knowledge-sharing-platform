const db = require("../../models/comment");
const User = db.user;
const Comment = db.comment;
const Article = db.article;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const createComment = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = Joi.object({
      content: Joi.string().required().min(5).max(1000).messages({
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment should have at least {#limit} characters",
        "string.max": "Comment should not exceed {#limit} characters",
        "any.required": "Comment content is required",
      }),
      article_id: Joi.number().integer().positive().required().messages({
        "number.base": "Article ID must be a number",
        "number.integer": "Article ID must be an integer",
        "number.positive": "Article ID must be positive",
        "any.required": "Article ID is required",
      }),
    }).validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
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

    const { content, article_id } = value;
    const user_id = req.user.id; // Assuming user is authenticated

    // Verify article exists
    const article = await Article.findByPk(article_id);
    if (!article) {
      return res.status(404).json(generateErrorResponse("Article not found"));
    }

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json(generateErrorResponse("User not found"));
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      article_id,
      created_by: user_id,
    });

    // Get the created comment with author details
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Prepare response
    const responseData = {
      id: createdComment.id,
      content: createdComment.content,
      created_at: createdComment.created_at,
      article: {
        id: article.id,
        title: article.title,
      },
      author: {
        id: createdComment.author.id,
        name: createdComment.author.name,
        email: createdComment.author.email,
      },
    };

    return res
      .status(201)
      .json(generateResponse("Comment created successfully", responseData));
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { createComment };
