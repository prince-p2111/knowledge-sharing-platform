require("dotenv").config();
const db = require("../../models/index");
const Article = db.article;
const User = db.user;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");

const getArticles = async (req, res) => {
  try {
    // Validate query parameters
    const { error: queryError, value: queryValue } = Joi.object({
      id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }).validate(req.query);

    if (queryError) {
      return res
        .status(400)
        .json(generateErrorResponse("Invalid query parameters"));
    }

    const { id, page, limit } = queryValue;

    // Single article fetch
    if (id) {
      const article = await Article.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "email"],
          },
          {
            model: db.article_revision,
            as: "revisions",
            order: [["revised_at", "DESC"]],
            limit: 10,
            include: [
              {
                model: User,
                as: "editor",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: db.article_summaries,
            as: "summary",
            attributes: ["summary", "generated_at"],
          },
        ],
      });

      if (!article) {
        return res.status(404).json(generateErrorResponse("Article not found"));
      }

      const responseData = {
        id: article.id,
        title: article.title,
        content: article.content,
        tags: article.tags,
        created_at: article.created_at,
        version: article.revisions.length + 1, // Current version
        author: {
          id: article.author.id,
          name: article.author.name,
          email: article.author.email,
        },
        summary: article.summary?.summary || null,
        revisions: article.revisions.map((rev) => ({
          id: rev.id,
          title: rev.title,
          content_preview: rev.content.substring(0, 100) + "...",
          revised_at: rev.revised_at,
          editor: {
            id: rev.editor.id,
            name: rev.editor.name,
          },
        })),
      };

      return res
        .status(200)
        .json(generateResponse("Article fetched successfully", responseData));
    }

    // Multiple articles fetch with pagination
    const offset = (page - 1) * limit;
    const { count, rows: articles } = await Article.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: db.article_summaries,
          as: "summary",
          attributes: ["summary"],
        },
      ],
      order: [["created_at", "DESC"]],
      attributes: ["id", "title", "created_at", "tags"],
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        tags: article.tags,
        created_at: article.created_at,
        summary: article.summary?.summary || null,
        author: {
          id: article.author.id,
          name: article.author.name,
        },
      })),
      pagination: {
        total: count,
        total_pages: totalPages,
        current_page: page,
        per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };

    return res
      .status(200)
      .json(generateResponse("Articles fetched successfully", responseData));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json(generateErrorResponse("Internal server error"));
  }
};

module.exports = { getArticles };
