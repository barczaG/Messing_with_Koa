
let exports = module.exports = {}
let dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8'
  }
}

exports.dbConfig
