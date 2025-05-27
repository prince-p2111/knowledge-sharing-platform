const db = require("../../models/comment");
const User = db.user;
const Comment = db.comment;
const Article = db.article;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const getComment = async (req, res) => {
  try {
    // Validate the comment ID from params
    const { error, value } = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Comment ID must be a number",
        "number.integer": "Comment ID must be an integer",
        "number.positive": "Comment ID must be a positive number",
        "any.required": "Comment ID is required",
      }),
    }).validate(req.params, {
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

    const commentId = value.id;

    // Fetch the comment with author and article details
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Article,
          as: "article",
          attributes: ["id", "title"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json(generateErrorResponse("Comment not found"));
    }

    const responseData = {
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      author: comment.author,
      article: comment.article,
    };

    return res
      .status(200)
      .json(generateResponse("Comment fetched successfully", responseData));
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { getComment };
