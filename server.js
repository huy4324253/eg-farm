require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./src/database');
const MainRoutes = require('./src/routes/index.routes');
const fileUpload= require('express-fileupload')
const app = express();

const PORT = process.env.PORT ||3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
  useTempFiles:true,
}))
// Routes
app.use('/', MainRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = { app, PORT, database }; // Export app instance and other variables
