import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _829bad9e = () => import('..\\pages\\user.vue' /* webpackChunkName: "pages_user" */).then(m => m.default || m)
const _acacbb9e = () => import('..\\pages\\user\\index.vue' /* webpackChunkName: "pages_user_index" */).then(m => m.default || m)
const _fa27064e = () => import('..\\pages\\user\\_id.vue' /* webpackChunkName: "pages_user__id" */).then(m => m.default || m)
const _b11e63ae = () => import('..\\pages\\news\\index.vue' /* webpackChunkName: "pages_news_index" */).then(m => m.default || m)
const _0403725e = () => import('..\\pages\\news\\_id.vue' /* webpackChunkName: "pages_news__id" */).then(m => m.default || m)
const _54567848 = () => import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/user",
			component: _829bad9e,
			children: [
				{
					path: "",
					component: _acacbb9e,
					name: "user"
				},
				{
					path: ":id",
					component: _fa27064e,
					name: "user-id"
				}
			]
		},
		{
			path: "/news",
			component: _b11e63ae,
			name: "news"
		},
		{
			path: "/news/:id",
			component: _0403725e,
			name: "news-id"
		},
		{
			path: "/",
			component: _54567848,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
