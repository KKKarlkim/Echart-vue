import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局样式
import './assets/css/global.less'
import axios from 'axios'
// 请求基准路径的配置
axios.defaults.baseURL = 'http://localhost:3000/api/'
// 将axios挂在到vue的原型对象上
Vue.prototype.$http = axios
// 在别的组件中可以通过this.$http 就可以实现axios请求

// 将全局的echarts对象挂在到Vue的原型对象上
// 别的组件中 this.$echarts 可以实现
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
