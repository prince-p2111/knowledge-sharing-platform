require("dotenv").config();
const db = require("../../models/index");
const Article = db.article;
const ArticleSummary = db.article_summaries;
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");
const Joi = require("joi");
const { GoogleGenAI } = require("@google/genai");

const createSummary = async (req, res) => {
  try {
    // Validate article ID
    const { error, value } = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Article ID must be a number",
        "number.integer": "Article ID must be an integer",
        "number.positive": "Article ID must be a positive number",
        "any.required": "Article ID is required",
      }),
    }).validate(req.params);

    if (error) {
      return res
        .status(400)
        .json(generateErrorResponse("Validation error", error.details));
    }

    const articleId = value.id;

    // Fetch the article
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json(generateErrorResponse("Article not found"));
    }

    // Check if summary already exists
    const existingSummary = await ArticleSummary.findOne({
      where: { article_id: articleId },
    });

    if (existingSummary) {
      // Return the existing summary
      return res.status(200).json(
        generateResponse(true, "Summary retrieved from database", {
          article_id: articleId,
          summary: existingSummary.summary,
        })
      );
    }

    // AI setup
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // replace hardcoded key with env variable
    });

    const generateSummary = async (articleContent) => {
      const prompt = `Please provide a concise summary of the following article content in 3-5 bullet points:\n\n${articleContent}`;
      try {
        const model = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        const text = model.candidates[0].content.parts[0].text;
        return text;
      } catch (error) {
        console.error("Error generating summary:", error);
        throw error;
      }
    };

    // Generate new summary
    const summaryText = await generateSummary(article.content);

    // Save the new summary in DB
    await ArticleSummary.create({
      article_id: articleId,
      summary: summaryText,
      generated_at: new Date(),
    });

    return res.status(200).json(
      generateResponse(true, "Summary generated successfully", {
        article_id: articleId,
        summary: summaryText,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", err));
  }
};

module.exports = { createSummary };
