let dbConfig = require('./db');
let knex = require("knex")(dbConfig);
let bookshelf = require('bookshelf')(knex);


// Have to figure out how and where to import bookshelf, and how it communicates
// with other files
const User = bookshelf.Model.extend({
  tableName = 'users',
});

module.exports = Bookshelf.model('User', User);
