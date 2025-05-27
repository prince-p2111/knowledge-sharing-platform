"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.article, {
        foreignKey: "article_id",
        as: "article",
      });
      comment.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "author",
      });
    }
  }
  comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
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
      created_by: {
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
      modelName: "comment",
      tableName: "comments",
      underscored: true, // Use snake_case for column names
      timestamps: true,
      paranoid: true, // Enable soft deletes
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return comment;
};
