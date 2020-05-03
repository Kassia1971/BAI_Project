import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Main from '../components/Main'
import Login from '../components/Login'
import SignUp from '../components/SignUp'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: isUnloggedRequired
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: isUnloggedRequired
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      beforeEnter: loginRequired
    },
    {
      path: '*',
      redirect: '/login',
      beforeEnter: isUnloggedRequired
    },
  ]
})

  async function loginRequired(to, from, next){
    const currentUser = await firebase.auth().currentUser;
    currentUser ? next() : next('/login')
  }

  async function isUnloggedRequired(to, from, next){
    const currentUser = await firebase.auth().currentUser;
    currentUser ? next('/main') : next()
  }

export default router
