
// Have to figure out how and where to import bookshelf, and how it communicates
// with other files
const User = bookshelf.Model.extend({
  tableName = 'users',

});

module.exports = Bookshelf.model('User', User);
