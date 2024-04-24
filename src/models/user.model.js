const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(245),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(246),
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:0
  },
  verification_code: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
   Phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetToken: {
    type: DataTypes.STRING, // Adjust the data type as needed
    allowNull: true, // Allow null since the token will be set when initiating reset
  }
}, {
  timestamps: false
});

module.exports = User;
