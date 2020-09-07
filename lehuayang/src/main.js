import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import '@babel/polyfill'
import './index.css'

import './assets/icon/font_1749906_r0l2yvovuq/iconfont.css'
import './assets/icon/font_1749906_r0l2yvovuq/iconfont.eot'
import './assets/icon/font_1749906_r0l2yvovuq/iconfont.svg'
import './assets/icon/font_1749906_r0l2yvovuq/iconfont.ttf'
Vue.prototype.imgapi = 'https://www.mysterycode.cn'
//路由守卫
// router.beforeEach((to, from, next) => {
//     if (to.path === '/login') {
//         next()
//     } else {
//         //验证是否登录
//         if (eval(sessionStorage.isAuth) === true) {
//             next()
//         } else {
//             next('/login')
//         }
//     }
// })
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
