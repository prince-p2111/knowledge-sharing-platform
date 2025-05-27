"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    static associate(models) {
      // define association here
      article.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "author",
      });
      article.hasMany(models.comment, {
        foreignKey: "article_id",
        as: "comments",
      });
      article.hasMany(models.article_revision, {
        foreignKey: "article_id",
        as: "revisions",
      });
      article.hasOne(models.article_summaries, {
        foreignKey: "article_id",
        as: "summary",
      });
    }
  }
  article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "article",
      tableName: "articles",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return article;
};
