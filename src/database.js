const { Sequelize } = require('sequelize');

// Create Sequelize instance with database configuration
const sequelize = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 3306, // MySQL default port
});

module.exports = sequelize;