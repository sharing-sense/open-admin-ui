import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, formatRouters } from '@/libs/util'
import config from '@/config'

const { homeName } = config
Vue.use(Router)
// 存放加载的动态路由
let dyncRouters = []
const router = new Router({
  routes: routes.concat(...dyncRouters),
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const turnTo = (to, access, next) => {
  if(!to.name){
    // 防止地址栏刷新跳转到401,强制跳转到home
    next({ replace: true, name: 'home' })
  }else if (canTurnTo(to.name, access, routes)) {
    // 有权限，可访问
    next()
  } else {
    // 无权限，重定向到401页面
    next({ replace: true, name: 'error_401' })
  }
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(res => {
        if (!dyncRouters || dyncRouters.length === 0) {
          dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access))
          // 防止重复添加路由报错
          router.addRoutes(dyncRouters)
          routes.push(...dyncRouters)
        }
        turnTo(to, store.state.user.access, next)
      }).catch(err => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
