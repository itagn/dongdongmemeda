/**
 *  Create by caidong on 2017/9
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 用户个人数据
    loading: false ,
  },
  getters: {
    getUser: state => state.user ,
    getLoading: state => state.loading,
  },
  mutations: {
    updateUser: (state, userInfo) => {
      state.user = userInfo
    },
    updateLoading: (state, loading) => {
      state.loading = loading
    },
    delectUser: state => {
      state.user = null
    },
  },
})
