const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const Comments = sequelize.define("Comments", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
},{
    tableName: 'comments',
    timestamps: false
});

// Comments.belongsTo(TopicsModel, { foreignKey: 'topic_id', targetKey: 'id' });
// Comments.belongsTo(UsersModel, { foreignKey: 'user_id', targetKey: 'id' });

module.exports = {
    Comments
};
