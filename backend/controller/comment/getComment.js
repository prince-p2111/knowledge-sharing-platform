const db = require("../../models/index");
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
    const comments = await Comment.findAll({
      where: { article_id: commentId },
      include: [
        {
          model: User,
          as: "author", // must match the alias defined in associations
          attributes: ["id", "name"], // optional: select user fields you want
        },
      ],
    });

    if (!comments) {
      return res.status(404).json(generateErrorResponse("Comment not found"));
    }

    return res
      .status(200)
      .json(generateResponse(true, "Comment fetched successfully", comments));
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { getComment };
