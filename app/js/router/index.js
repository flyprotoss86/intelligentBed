import Vue from "vue"
import Router from "vue-router"
import Home from "../home/index.vue"
import Detail from "../detail/index"
import "../../css/reset.scss"
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/detail",
            name: "Detail",
            component: Detail,
        },


    ],
})
