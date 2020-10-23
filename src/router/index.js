import Vue from 'vue'
import VueRouter from 'vue-router'
import Desktop from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Desktop
  },
  {
    path: '/desktop',
    name: 'Desktop',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Desktop.vue')
  },
  {
    path: '/mobile',
    name: 'Mobile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Mobile.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
