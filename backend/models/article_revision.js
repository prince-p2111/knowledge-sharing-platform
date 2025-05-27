"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class article_revision extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      article_revision.belongsTo(models.article, {
        foreignKey: "article_id",
        as: "article",
      });
      article_revision.belongsTo(models.user, {
        foreignKey: "revised_by",
        as: "editor",
      });
    }
  }
  article_revision.init(
    {
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "articles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      revised_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revised_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "article_revision",
      tableName: "article_revisions",
      underscored: true, // Use snake_case for column names
      timestamps: true,
      paranoid: true, // Enable soft deletes
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return article_revision;
};
