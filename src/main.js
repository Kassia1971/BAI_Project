import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import store  from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(firestorePlugin)

firebase.initializeApp({
  apiKey: 'AIzaSyBS3OvT4JsvfUYHsuD3eq5pEUrBPC2R2tc',
  authDomain: 'bai-project-db-e040d.firebaseapp.com',
  databaseURL: 'https://bai-project-db-e040d.firebaseio.com',
  projectId: 'bai-project-db-e040d',
  storageBucket: 'bai-project-db-e040d.appspot.com',
  messagingSenderId: '710088942329'
})

export const db = firebase.firestore()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
