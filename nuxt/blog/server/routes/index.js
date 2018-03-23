'use strict'

const Router = require('koa-router')
const Menu = require('../app/controllers/menu')
const App = require('../app/controllers/app')
module.exports = function () {
  var router = new Router({
    // prefix: '/api'
  })
  // 
  router.get('/', async (ctx, next) => {
    await ctx.render('index', {
      title: 'koa2 API',
      list: [{name: 'menu',path: '/menu'}]
    })
  })

  router.get('/menu', async (ctx, next) => {
    await ctx.render('index', {
      title: 'menu API list',
      list: [{name: 'add',path: '/menu/add'},{name: 'delete',path: '/menu/delete'},{name: 'update',path: '/menu/update'},{name: 'list',path: '/menu/list'}]
    })
  })
  // login
  router.get('/login', App.login)
  // Menu
  router.get('/menu/add', Menu.add)
  router.get('/menu/delete', Menu.delete)
  router.get('/menu/update', Menu.update)
  router.get('/menu/list', Menu.list)

  return router
}