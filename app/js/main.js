import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "babel-polyfill"

// //引入echarts
// import echarts from 'echarts'
//
// Vue.prototype.$echarts = echarts

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>",
})
/* eslint-enable no-new */
