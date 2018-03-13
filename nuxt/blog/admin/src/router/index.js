import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import home from '@/pages/home'
import index from '@/pages/index'
import menu from '@/pages/menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      children: [
        {
          path: '/index',
          name: 'index',
          component: index
        },
        {
          path: '/menu',
          name: 'menu',
          component: menu
        }
      ]
    }
  ]
})
