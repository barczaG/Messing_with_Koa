let koa = require('koa')
let app = koa()
let dbConfig = require('./db')

let knex = require('knex')(dbConfig)
let bookshelf = require('bookshelf')(knex)

app.set('bookshelf', bookshelf)
