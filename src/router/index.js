/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
// 全局路由(无需嵌套上左右整体布局)

const globalRoutes = [
  {
    path: '/404',
    component: _import('common/404'),
    name: '404',
    meta: { title: '404未找到' }
  },
  {
    path: '/login',
    component: _import('common/login'),
    name: 'login',
    meta: { title: '登录' }
  }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/home',
      component: _import('common/home'),
      name: 'home',
      meta: { title: '首页' }
    },
    {
      path: '/theme',
      component: _import('common/theme'),
      name: 'theme',
      meta: { title: '主题' }
    },
    {
      path: '/demo-echarts',
      component: _import('demo/echarts'),
      name: 'demo-echarts',
      meta: { title: 'demo-echarts', isTab: true }
    },
    {
      path: '/demo-ueditor',
      component: _import('demo/ueditor'),
      name: 'demo-ueditor',
      meta: { title: 'demo-ueditor', isTab: true }
    }
  ],
  beforeEnter (to, from, next) {
    handleAuthCheck(next)
  }
}

/**
 * 处理权限检查
 * @param {*} next
 */
function handleAuthCheck (next) {
  const token = Vue.cookie.get('token')
  if (!token || !/\S/.test(token)) {
    clearLoginInfo()
    next({ name: 'login' })
  } else {
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  if (shouldAddDynamicRoutes(to)) {
    fetchAndAddDynamicRoutes(to, next)
  } else {
    next()
  }
})

/**
 * 判断是否应该添加动态路由
 * @param {*} to
 * @returns {boolean}
 */
function shouldAddDynamicRoutes (to) {
  return (!router.options.isAddDynamicMenuRoutes && fnCurrentRouteType(to, globalRoutes) !== 'global')
}

/**
 * 获取菜单列表并添加动态路由
 * @param {*} to
 * @param {*} next
 */
function fetchAndAddDynamicRoutes (to, next) {
  http({
    url: http.adornUrl('/sys/permission/nav'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    if (data && data.code === 200) {
      fnAddDynamicMenuRoutes(data.data)
      router.options.isAddDynamicMenuRoutes = true
      sessionStorage.setItem('menuList', JSON.stringify(data.data || '[]'))
      // sessionStorage.setItem('permissions', JSON.stringify(data.data || '[]'));
      next({ ...to, replace: true })
    } else {
      sessionStorage.setItem('menuList', '[]')
      // sessionStorage.setItem('permissions', '[]');
      next()
    }
  }).catch(e => {
    console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    router.push({ name: 'login' })
  })
}

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (const globalRoute of globalRoutes) {
    if (route.path === globalRoute.path) {
      return 'global'
    } else if (globalRoute.children && globalRoute.children.length >= 1) {
      temp = temp.concat(globalRoute.children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  let temp = []
  for (const menu of menuList) {
    if (menu.children && menu.children.length >= 1) {
      temp = temp.concat(menu.children)
    } else if (menu.url && /\S/.test(menu.url)) {
      const route = createRouteFromMenu(menu)
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    finalizeDynamicRoutes(routes)
  }
}

/**
 * 根据菜单创建路由
 * @param {*} menu
 * @returns {object} route
 */
function createRouteFromMenu (menu) {
  menu.url = menu.url.replace(/^\//, '')
  const route = {
    path: menu.url.replace('/', '-'),
    component: null,
    name: menu.url.replace('/', '-'),
    meta: {
      id: menu.id,
      title: menu.name,
      isDynamic: true,
      isTab: true,
      iframeUrl: ''
    }
  }
  // url以http[s]://开头, 通过iframe展示
  if (isURL(menu.url)) {
    route.path = `i-${menu.id}`
    route.name = `i-${menu.id}`
    route.meta.iframeUrl = menu.url
  } else {
    try {
      route.component = _import(`modules/${menu.url}`) || null
    } catch (e) {
      console.error('Error importing module:', e)
    }
  }
  return route
}

/**
 * 完成动态路由的添加
 * @param {*} routes
 */
function finalizeDynamicRoutes (routes) {
  mainRoutes.name = 'main-dynamic'
  mainRoutes.children = routes
  router.addRoutes([mainRoutes, { path: '*', redirect: { name: '404' } }])
  sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  console.log('\n')
  console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
  console.log(mainRoutes.children)
  console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
}

export default router
