'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UserReact.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      }),
      models.UserReact.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
        }
      })
    }
  };
  UserReact.init({
    type: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserReact',
  });
  return UserReact;
};