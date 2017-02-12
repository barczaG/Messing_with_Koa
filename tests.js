const logger = require('koa-logger')
const route = require('koa-route')
const parse = require('co-body')
const koa = require('koa')
const app = koa()
const co = require('co')
let bcrypt = require('bcryptjs')

const test = require('tape')
const supertest = require('supertest')

const dbHost = process.env.DB_HOST || 'localhost:5432'
const dbName = process.env.DB_NAME || 'ioffice'
const dbUser = process.env.DB_USER || 'ioffice'
const dbPassword = process.env.DB_PASSWORD
if (!dbPassword) throw new Error('Missing db password')

const Sequelize = require('sequelize')
const conStr = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`
const sequelize = new Sequelize(conStr)

app.use(logger())

app.use(route.post('/api/register', register))
app.use(route.post('/api/login', login))



let server
let request
test('Start server', t => {
  server = app.listen()
  request = supertest(server)
  t.end()
})

/*
// This email address constantly needs changing, as each test adds it to the database
// There should be a way to delete it once the test is ran
test('Register with valid email and valid password', t => {
  server = app.listen()
  request
    .post('/api/register')
    .send({ email: 'email12@email.com', password: 'somepassword' })
    .expect(200)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.body.email, 'email12@email.com')
      t.equals(res.status, 200) // new addition
      t.end()
    })
})
*/

test('Register with already existing email and valid password', t => {
  server = app.listen()
  request
    .post('/api/register')
    .send({ email: 'email7@email.com', password: 'someotherpassword' })
    .expect(400)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.text, 'email must be unique') // can't access message
      t.end()
    })
})


test('Register with no input in either email or password', t => {
  server = app.listen()
  request
   .post('/api/register')
   .send({ email: '', password: '' })
   .expect(400)
   .end((err, res) => {
     if (err) throw err

     t.equals(res.text, 'You need to input a valid email address!')
     t.end()
   })
})

test('Register with no input in email but "valid" password', t => {
  server = app.listen()
  request
   .post('/api/register')
   .send({ email: '', password: 'testpassword' })
   .expect(400)
   .end((err, res) => {
     if (err) throw err

     t.equals(res.text, 'You need to input a valid email address!')
     t.end()
   })
})


test('Login with valid email and password', t => {
  server = app.listen()
  request
    .post('/api/login')
    .send({ email: 'smth3g@smthig.com', password: 'testpassword' })
    .expect(200)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.body.email, 'smth3g@smthig.com')
      t.end()
    })
})

test('Login with valid email and invalid password', t => {
  server = app.listen()
  request
    .post('/api/login')
    .send({ email: 'smth3g@smthig.com', password: 'wrongpassword' })
    .expect(400)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.text, 'Invalid password')
      t.end()
    })
})


test('Login with invalid email and invalid password', t => {
  server = app.listen()
  request
    .post('/api/login')
    .send({ email: 'wrong@email.com', password: 'wrongpassword' })
    .expect(400)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.text, 'User not found')
      t.end()
    })
})

test('Login no email and no password', t => {
  server = app.listen()
  request
    .post('/api/login')
    .send({ email: '', password: '' })
    .expect(400)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.text, 'You need to input a valid email address!')
      t.end()
    })
})
/*
test('Login with no authentication token', t => {
  server = app.listen()
  request
    .post('/api/login')
    .send({ email: 'smth3g@smthig.com', password: 'testpassword' })
    .expect(401)
    .end((err, res) => {
      if (err) throw err

      t.equals(res.text, 'No authentication token found')
      t.end()
    })
})
*/
