"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class article_summaries extends Model {
    static associate(models) {
      article_summaries.belongsTo(models.article, {
        foreignKey: "article_id",
        as: "article",
      });
    }
  }
  article_summaries.init(
    {
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "articles", // This is correct as it refers to the table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "article_summaries",
      tableName: "article_summaries",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return article_summaries;
};
