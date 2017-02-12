const koaJwt = require('koa-jwt')

module.exports = koaJwt({
  secret: 'ioffice' //process.env.SECRET_KEY
})
