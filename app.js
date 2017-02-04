let koa = require('koa')
let app = koa()

let Sequelize = require('sequelize')
let connection = new Sequelize('test', process.env.DB_HOST, process.env.DB_PASSWORD, {
  dialect: 'postgres'
})
