import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css' // 引入组件库样式文件
import store from './store'
import info from '../config/info'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.use(VueResource)
Vue.use(ElementUI)  // 加载element组件

// 跨域使用
Vue.http.options.xhr = { withCredentials: false }
// 设置http拦截器
Vue.http.interceptors.push((request, next) => {
  // 修改请求的url地址
  request.url = info.serverAddress.url + request.url
  next((response) => {
    return response;
  });
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
