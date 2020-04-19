import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Todos from '../components/Todos'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import SearchUrl from '../components/SearchUrl'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/todos',
      name: 'Todos',
      component: Todos,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/searchUrl',
      name: 'SearchUrl',
      component: SearchUrl,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('todos')
  else next()
})

export default router
