import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({

state: {
    user_id: '',
    joke: ''
  },

  mutations: {
    setUserId (state, userId) {
      state.user_id = userId
    },
    setJoke (state, joke){
      state.joke = joke
    }
  },

  actions: {
    setUserId ({commit}, payload) {
      commit('setUserId', payload)
    },
    setJoke ({commit}, payload) {
      commit('setJoke', payload)
    }
  },

  getters: {
    userId (state) {
      return state.user_id
    },
    joke (state) {
      return state.joke
    }
  }
})
