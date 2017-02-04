
let Sequelize = require('sequelize')
let connection = new Sequelize('test', process.env.DB_HOST, process.env.DB_PASSWORD, {
  dialect: 'postgres'
})
let bcrypt = require('bcryptjs')

let User = connection.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  instanceMethods: {
    validPassword: function (password) {
      return bcrypt.compareSync(password, this.password)
    }
  },
  hooks: {
    afterValidate: function (user) {
      // Async implementation
      return bcrypt.hash(user.password, 7).then(function (hash) {
        return user.password = hash
      })
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
