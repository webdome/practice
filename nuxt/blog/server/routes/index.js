'use strict'

const Router = require('koa-router')
const Menu = require('../app/controllers/menu')
module.exports = function(){
	var router = new Router({
    // prefix: '/api'
  })

  // Menu
  router.get('/menu/add', Menu.add)
  router.get('/menu/delete', Menu.delete)
  router.get('/menu/update', Menu.update)
  router.get('/menu/list', Menu.list)

  return router
}