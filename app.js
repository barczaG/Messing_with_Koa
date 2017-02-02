let koa = require('koa');
let app = koa();

let dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'root',
    password: //PLACEHOLDER
    database: //PLACEHOLDER
    charset: 'utf8'
  }
};

let knex = require('knex')(dbConfig);
let bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);
