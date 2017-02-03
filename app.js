let koa = require('koa')
let app = koa()
let bcrypt = require('bcryptjs')

// fix this
let dbConfig = require('./db')
let Sequelize = require('sequelize')
let connection = new Sequelize('test', process.env.DB_HOST, process.env.DB_PASSWORD, {
  dialect: 'postgres'
})

// Everything under this should be deleted once I got it to run
let User = connection.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      // Revisit this when I understand bcrypt better
      len: [8, 255],
      message: 'Your password is too short'
    }
  }
}, {
  hooks: {
    afterCreate: function (res) {
      console.log('afterCreate: Created article with id ', res.dataValues.id)
    },
    afterValidate: function (user) {
      user.password = bcrypt.hashSync(user.password, 8)
    }
  }
})

// Teszthez
// Production előtt kitörölni
User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    username: 'username',
    password: 'password'
  })
})
