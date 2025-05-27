require("dotenv").config();
const db = require("../../models/index");
const Article = db.article;
const User = db.user;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const updateArticle = async (req, res) => {
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

    // Validate request body
    const { error, value } = Joi.object({
      title: Joi.string().min(5).max(255).messages({
        "string.empty": "Title cannot be empty",
        "string.min": "Title should have at least {#limit} characters",
        "string.max": "Title should not exceed {#limit} characters",
      }),
      content: Joi.string().min(50).messages({
        "string.empty": "Content cannot be empty",
        "string.min": "Content should have at least {#limit} characters",
      }),
      tags: Joi.array().items(Joi.string()).optional(),
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

    const articleId = req.params.id;
    const userId = req.user.id;

    // Start transaction for atomic operations
    const transaction = await db.sequelize.transaction();

    try {
      // Find the article
      const article = await Article.findOne({
        where: { id: articleId },
        transaction,
      });

      if (!article) {
        await transaction.rollback();
        return res.status(404).json(generateErrorResponse("Article not found"));
      }

      // Check authorization
      if (article.created_by !== userId && req.user.role !== "admin") {
        await transaction.rollback();
        return res
          .status(403)
          .json(
            generateErrorResponse(
              "You are not authorized to update this article"
            )
          );
      }

      // Create revision before updating (versioning)
      await db.article_revision.create(
        {
          article_id: article.id,
          title: article.title,
          content: article.content,
          revised_by: userId,
        },
        { transaction }
      );

      // Update the article
      const updatedFields = {};
      if (value.title) updatedFields.title = value.title;
      if (value.content) updatedFields.content = value.content;
      if (value.tags !== undefined) updatedFields.tags = value.tags;

      await article.update(updatedFields, { transaction });

      // Commit transaction
      await transaction.commit();

      // Get updated article with author info
      const updatedArticle = await Article.findOne({
        where: { id: articleId },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "email"],
          },
        ],
        transaction,
      });

      // Get revision count
      const revisionCount = await db.article_revision.count({
        where: { article_id: articleId },
        transaction,
      });

      // Prepare response
      const responseData = {
        id: updatedArticle.id,
        title: updatedArticle.title,
        content: updatedArticle.content,
        tags: updatedArticle.tags,
        version: revisionCount + 1, // Current version (revisions + original)
        updated_at: updatedArticle.updated_at,
        author: {
          id: updatedArticle.author.id,
          name: updatedArticle.author.name,
          email: updatedArticle.author.email,
        },
      };

      return res
        .status(200)
        .json(generateResponse("Article updated successfully", responseData));
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error updating article:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { updateArticle };
