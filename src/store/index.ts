import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null // 当前用户登录状态
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
