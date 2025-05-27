const db = require("../../models/comment");
const User = db.user;
const Comment = db.comment;
const Article = db.article;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const updateComment = async (req, res) => {
  try {
    // Validate params and body
    const schemaParams = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Comment ID must be a number",
        "number.integer": "Comment ID must be an integer",
        "number.positive": "Comment ID must be a positive number",
        "any.required": "Comment ID is required",
      }),
    });

    const schemaBody = Joi.object({
      content: Joi.string().min(5).max(1000).required().messages({
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment should have at least {#limit} characters",
        "string.max": "Comment should not exceed {#limit} characters",
        "any.required": "Comment content is required",
      }),
    });

    const { error: paramsError } = schemaParams.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
    });

    const { error: bodyError, value: bodyValue } = schemaBody.validate(
      req.body,
      {
        abortEarly: false,
        allowUnknown: false,
      }
    );

    if (paramsError || bodyError) {
      const errors = [
        ...(paramsError?.details || []),
        ...(bodyError?.details || []),
      ].map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res
        .status(400)
        .json(generateErrorResponse("Validation error", errors));
    }

    const commentId = parseInt(req.params.id);
    const { content } = bodyValue;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find comment
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json(generateErrorResponse("Comment not found"));
    }

    // Authorization check
    if (userRole !== "admin" && comment.created_by !== userId) {
      return res
        .status(403)
        .json(
          generateErrorResponse("You are not authorized to update this comment")
        );
    }

    // Update the comment
    comment.content = content;
    await comment.save();

    // Fetch updated comment with author
    const updatedComment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.status(200).json(
      generateResponse("Comment updated successfully", {
        id: updatedComment.id,
        content: updatedComment.content,
        created_at: updatedComment.created_at,
        author: updatedComment.author,
      })
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { updateComment };
