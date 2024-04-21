require('dotenv').config();

module.exports = {
  secretKey: process.env.SECRET_KEY ,
  databaseURI: process.env.DATABASE_URI ,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL,
};
