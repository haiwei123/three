import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import threeCore from '@/libs/ThreeCore'
Vue.use(ElementUI);

Vue.config.productionTip = false

//挂载threejs实例
Vue.prototype.$threeCore = new threeCore("threeContainer");

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
