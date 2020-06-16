import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from '@/store/index'
import router from '@/router/index'

import '@/icons' // icon
import '@/permission' // permission control
import { parseTime } from '@/utils/index';
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.filter('statusname', function (value) {
  let ret = '';
  switch (value) {
    case 0:
      ret = '禁用';
      break;
    case 1:
      ret = '启用';
      break;
  }
  return ret;
});
Vue.directive('has', {
  bind: function (el, binding, vnode) { },
  inserted: function (el, binding, vnode, oldVnode) {
    const funs = vnode.context.$route.meta.fun;
    if (funs) {
      const hadfun = funs.filter(item => {
        return item.title === binding.value.fun
      })
      if (hadfun.length === 0) {
        el.parentNode.removeChild(el);
      }
    } else {
      el.parentNode.removeChild(el);
    }
  }
});
var vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
export default vue
