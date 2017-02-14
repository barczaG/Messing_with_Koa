const logger = require('koa-logger')
const route = require('koa-route')
const parse = require('co-body')
const koa = require('koa')
const app = koa()
const router = require('koa-router')()

const Promise = require('bluebird')
const jwt = require('koa-jwt')
const jsonwebtoken = Promise.promisifyAll(require('jsonwebtoken'))
let bcrypt = require('bcryptjs')

const dbHost = process.env.DB_HOST || 'localhost:5432'
const dbName = process.env.DB_NAME || 'ioffice'
const dbUser = process.env.DB_USER || 'ioffice'
const dbPassword = process.env.DB_PASSWORD
const dbUri = process.env.DB_URI
if (!dbPassword && !dbUri) throw new Error('Missing db password')

const jwtSecret = process.env.SECRET_KEY || 'random-secret'

const Sequelize = require('sequelize')
const conStr = dbUri || `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`
const sequelize = new Sequelize(conStr)

app.use(logger())

router.post('/api/register', register)
router.post('/api/login', login)
router.post('/api/protect', jwt({secret: jwtSecret}), protect)
app
.use(router.routes())
.use(router.allowedMethods())

// app.use(route.post('/api/register', register))
// app.use(route.post('/api/login', login))
// app.use(route.post('/api/protect', jwt({secret: jwtSecret}), protect))

function * register () {
  const body = yield parse(this)
  if (body === null) {
    this.throw(400, 'You need to fill out the form!')
  }
  // Redundant?
  if (body.email === '') {
    this.throw(400, 'You need to input a valid email address!')
  }
  let existingUser = yield User.findOne({
    where: {email: body.email}
  })
  if (existingUser !== null) {
    this.throw(400, 'email must be unique')
  }
  let user
  try {
    if (body.password.length < 6) {
      this.throw(400, 'Your password is too short.')
    } else {
      user = yield User.create(body)
    }
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      this.status = 400
      this.body = {validationErrors: e.errors}
      return
    } else {
      throw e
    }
  }
  this.body = user
  console.log(user)
}

function * login () {
  const body = yield parse(this)
  if (body.email === '') {
    this.throw(400, 'You need to input a valid email address!')
  }
  if (body.password === '') {
    this.throw(400, 'You need to input a password!')
  }
  let user = yield User.findOne({
    where: {
      email: body.email
    }
  })
  if (!user) this.throw(400, 'User not found')
  const compare = yield bcrypt.compare(body.password, user.password)
  if (!compare) this.throw(400, 'Invalid password')
  let token = jsonwebtoken.sign({user: user.id}, jwtSecret)
  //jwt.sign({ user: user }, process.env.SECRET_KEY, { algorithm: 'RS256' }, function (err, token) {
  //  console.log(token)
  //})
  /*
  jsonwebtoken.signAsync({user: user.id}, process.env.SECRET_KEY,
    { algorithm: 'RS256'}).then(function (token) {

    })*/
  this.body = token
}

function * protect () {
  this.body = 'Jwt worked'
  console.log('????')
}

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

const port = process.env.PORT || 3000
console.log('Initing db...')
User.sync().then(() => {
  app.listen(3000)
  console.log('Listening on port ', port)
})
