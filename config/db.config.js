module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB,
  PORT: process.env.DB_PORT,
  dialect: "mysql",
  pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 30000
  }
};
