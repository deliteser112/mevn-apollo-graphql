// IMPORTS
import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'

Vue.use(Router)

// ROUTES
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage
  }
]
// EXPORT ROUTER
export default new Router({
  mode: 'history',
  routes
})
