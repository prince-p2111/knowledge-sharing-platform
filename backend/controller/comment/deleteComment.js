const db = require("../../models/comment");
const User = db.user;
const Comment = db.comment;
const Article = db.article;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");

const deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role; // assuming role is available in req.user

    if (isNaN(commentId)) {
      return res.status(400).json(generateErrorResponse("Invalid comment ID"));
    }

    // Fetch the comment
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json(generateErrorResponse("Comment not found"));
    }

    // If user is not admin, ensure they are the creator
    if (userRole !== "admin" && comment.created_by !== userId) {
      return res
        .status(403)
        .json(
          generateErrorResponse("You are not authorized to delete this comment")
        );
    }

    // Delete the comment
    await comment.destroy();

    return res
      .status(200)
      .json(generateResponse("Comment deleted successfully"));
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { deleteComment };
