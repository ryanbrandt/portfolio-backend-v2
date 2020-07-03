const DBConfig = {
  host: process.env.PORTFOLIO_DB_HOST,
  port: 3306,
  user: process.env.PORTFOLIO_DB_USER,
  password: process.env.PORTFOLIO_DB_SECRET,
  database: process.env.PORTFOLIO_DB,
};

module.exports = {
  DBConfig,
};
