import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({

state: {
    user_id: '',
    user_email: ''
  },

  mutations: {
    setUserData (state, payload) {
      state.user_id = payload.uid
      state.user_email = payload.email
    }
  },

  actions: {
    setUserData ({commit}, payload) {
      commit('setUserData', payload)
    }
  },

  getters: {
    userId (state) {
      return state.user_id
    },
    userEmail (state) {
      return state.user_email
    }
  }
})
