//index.js
const { app, PORT, database } = require('./server');

// Start the server after establishing the database connection
database.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
