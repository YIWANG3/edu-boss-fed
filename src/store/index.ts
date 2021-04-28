import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前用户登录状态
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 注意本地存储只能存字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
