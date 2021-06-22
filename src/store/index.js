import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 用于 存储组件间共享的数据
  state: {
    // 用于用户登录成功后保存用户信息（初始值尝试读取本地存储的信息）
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    // 存储用户信息
    setUser (state, payload) {
      // 将 payload 的 JSON 数据格式转换为 对象格式存储：提高易读性
      state.user = JSON.parse(payload)
      // 将 payload 数据存储到本地：数据持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
