
let Sequelize = require('sequelize')
let connection = new Sequelize('test', process.env.DB_HOST, process.env.DB_PASSWORD, {
  dialect: 'postgres'
})
let bcrypt = require('bcryptjs')

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true // added after API accepted empty input, not sure if needed
    }
  }
}, {
  hooks: {
    afterValidate: function (user) {
      // Async implementation
      if (user.password.length >= 6) { // added when API accepted empty input for password, not sure if needed
        return bcrypt.hash(user.password, 7).then(function (hash) {
          user.password = hash
          return user
        })
      }
    }
  }
})

// Teszthez
// Production előtt kitörölni
User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    username: 'testUser',
    password: 'testPass'
  })
})
