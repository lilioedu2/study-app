const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const UserModel = sequelize.define("User", {
  //Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull:false
  },
  last_name:{
    type: DataTypes.STRING,
    allowNull:true
  },
  avatar:{
    type: DataTypes.STRING,
    allowNull:true
  },
  email:{
    type: DataTypes.STRING,
    allowNull:true
  },
  password:{
    type: DataTypes.STRING,
    allowNull:true
  },
  deleted:{
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
},{
    //Other model options go here
    tableName: 'users',
    timestamps: false
});

module.exports = {
    UserModel
};