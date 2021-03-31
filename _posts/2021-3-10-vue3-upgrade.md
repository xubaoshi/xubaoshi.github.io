---
layout: post
title: 'vue3 升级步骤记录(vue-cli 相关)'
date: '2021-3-20'
author: 'XuBaoshi'
header-img: 'img/post-bg-06.jpg'
---

# vue3 升级步骤记录(vue-cli 相关)

本次 vue3 升级记录主要针对使用 vuecli 生成的项目主要针对：依赖包、vue.config.js 配置、.eslint.js、路由、store、国际化、main.js 等所涉及到的变更记录。<br />

<a name="07iSu"></a>

## package.json

```json
{
  "dependencies": {
    "element-plus": "^1.0.2-beta.32",
    "vue": "^3.0.5",
    "vue-i18n": "^9.0.0-rc.6",
    "vue-router": "^4.0.1",
    "vuex": "^4.0.0-rc.2"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.5.11",
    "@vue/cli-service": "^4.5.11",
    "@vue/compiler-sfc": "^3.0.5",
    "eslint": "^7.0.0",
    "eslint-plugin-vue": "^7.6.0",
    "vue-loader-v16": "^16.0.0-beta.5.4"
  }
}
```

删除 element-ui 替换成 element-plus ， vue-loader-v16 需要重新添加， 其他的包只需要升级即可。<br />

<a name="2Vb68"></a>

## vue.config.js

<br />vue-cli3.x vue.config.js 需要更改为如下：

```javascript
{
  // baseurl 修改为 publicPath
  publicPath: isProduction ? './' : '/'
  css: {
    // modules 修改为 requireModuleExtension
    requireModuleExtension: true
  }
}
```

<a name="FMLhS"></a>

## .eslintrc.js

<br />eslint 所涉及到校验规则也需要进行升级<br />
<br />[eslint-plugin-vue](https://eslint.vuejs.org/)

```javascript
{
	extends： {
  	'standard',
    'prettier',
    'prettier/standard',
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    'plugin:vue/recommended'
  }
}
```

替换成<br />

```javascript
{
	extends： {
  	'standard',
    'prettier',
    'prettier/standard',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended'
  }
}
```

<a name="WMQj5"></a>

## 路由

<br />vue-router 所涉及到只需要将 api 更换下即可<br />

<a name="c"></a>

### 初始化

<br />`src/router/index.js`

vue2.0

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

//...

Vue.use(VueRouter)

export function initRouter() {
  let router = new VueRouter({
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRouterMap,
  })

  //...

  return router
}
```

vue3.0

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import store from '@/store'

// 导出路由 在 main.js 里使用
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes,
})
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
  store.dispatch('setPageTip', '')
})

export default router
```

<a name="lTaba"></a>

### 页面引入方式（动态加载）

<br />vue2.0<br />

```javascript
{
  path: '/404',
  component: resolve => require(['@/views/404'], resolve),
  hidden: true
}
```

<br />vue3.0

```javascript
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}
```

<a name="yjkDz"></a>

### 默认页面配置

<br />vue2.0<br />

```javascript
{ path: '*', redirect: '/404', hidden: true }
```

<br />vue3.0

```javascript
{
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
}
```

<br />[参考文档](https://next.router.vuejs.org/guide/migration/#moved-the-base-option)<br />

<a name="4xU1O"></a>

## store

vue-router   所涉及到只需要将 api 更换下即可<br />
<br />`src/store/index.js`

vue2.0

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app/index'

// ...

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    // ...
  },
  getters,
})

if (process.env.NODE_ENV === 'development') {
  Object.assign(store, {
    plugins: [createLogger()],
  })
}

export default store
```

vue3.0

```javascript
import { createStore } from 'vuex'

// modules
import app from './modules/app'
import demo from './modules/demo'

// getters
import getters from './getters'

const storeTree = {
  modules: {
    app,
    demo,
  },
  getters,
}

const store = createStore(Object.assign({}, storeTree))

export default store
```

<br />

<a name="136eo"></a>

## main.js

<br />`src/main.js`<br />
<br />vue2.0

```javascript
import Vue from 'vue'
import moment from 'moment'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import '@/framework/styles/index.scss'

import { getI18n } from './lang'
import utils from '@/framework/utils/common'
import apis from '@/apis'
import '@/framework/components'

Object.defineProperty(Vue.prototype, '$moment', { value: moment })
Object.defineProperty(Vue.prototype, '$utils', { value: utils })
Object.defineProperty(Vue.prototype, '$apis', { value: apis })

const isProduction = process.env.NODE_ENV === 'production'

//...

Vue.config.productionTip = false
const glbalFilePath = isProduction
  ? 'static/global-config.json'
  : 'static/global-config-dev.json'
axios.get(glbalFilePath).then((res) => {
  let i18n = getI18n(res.data['LANGUAGE'])
  window.ajaxBaseUrl = res.data['BASE_URL']
  //...
  Vue.use(ElementUI, {
    size: 'medium',
    i18n: (key, value) => i18n.t(key, value),
  })
  Vue.prototype.g_Config = res.data
  axios.setConfig(Vue.prototype.g_Config)
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount('#app')
})
```

<br />vue3.0<br />

```javascript
// 1.
import { createApp } from 'vue'
import moment from 'moment'
import axios from 'axios'
// 2.
import ElementPlus from 'element-plus'

import router from './router'
import store from './store'
import App from './App'
import '@/framework/styles/index.scss'

import { getI18n } from './lang'
import utils from '@/framework/utils/common'
import apis from '@/apis'
import initGlobalComponents from '@/framework/components'
import defaultConfig from '../public/static/global-config.json'

// 3.
const app = createApp(App)
const isProduction = process.env.NODE_ENV === 'production'

// 4.
app.config.globalProperties.$moment = moment
app.config.globalProperties.$utils = utils
app.config.globalProperties.$apis = apis

// 5.
// router
app.use(router)

// vuex
app.use(store)

// 6.
// 全局组件
initGlobalComponents(app)

// 设置 baseURL
axios.setConfig = function (config) {
  axios.defaults.baseURL = config.BASE_URL
  axios.defaults.timeout = config.AJAX_TIMEOUT
}

const glbalFilePath = isProduction
  ? 'static/global-config.json'
  : 'static/global-config-dev.json'
axios.get(glbalFilePath).then((res) => {
  res.data = Object.assign(defaultConfig, res.data)
  //...
  let i18n = getI18n(res.data['LANGUAGE'])
  window.ajaxBaseUrl = res.data['BASE_URL']
  app.use(i18n)
  app.use(ElementPlus, {
    size: 'medium',
    i18n: i18n.global.t,
  })
  app.config.globalProperties.g_Config = res.data
  axios.setConfig(res.data)
  // 7.
  app.mount('#app')
})
```

<a name="FFqWt"></a>

## vue 语法修改

<a name="hxjRx"></a>

### 组件注册

```javascript
// import { createApp } from 'vue'
// const app = createApp(App)

import TablePopover from './TablePopover'
import Textbox from './Textbox'

const initLocalComponents = (app) => {
  app.component('table-popover', TablePopover)
  app.component('text-box', Textbox)
}

export default initLocalComponents
```

<a name="ahYDC"></a>

### 组件实例内部方法

<br />vue2.0<br />

```javascript
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
```

<br />vue3.0

```javascript
app.config.globalProperties.$moment = moment
```

<a name="xz3ca"></a>

### eventBus

<br />在 2.x 中，Vue 实例可以用事件 API（`$on`、`$off`  和  `$once`）强制附加的处理代码逻辑， 但是在 3.x 中这些 api 已经废弃， 项目升级时需要官方推荐的是第三方库

`src/framework/eventBus.js`<br />
<br />vue2.0

```javascript
import Vue from 'vue'
export default new Vue()
```

<br />vue3.0<br />
<br />官方推荐的库：<br />[mitt](https://github.com/developit/mitt)<br />[tiny-emitter](https://github.com/scottcorgan/tiny-emitter)

```javascript
import mitt from 'mitt'

const emitter = mitt()
emitter['$on'] = emitter.on
emitter['$emit'] = emitter.emit
emitter['$off'] = emitter.off

export default emitter
```

<a name="5Qzkw"></a>

## element-plus 语法修改

<a name="7eeqU"></a>

### styles

<br />涉及到 element-ui 的引用均要替换成 element-plus<br />
<br />`styles/index.scss`<br />
<br />vue2.0

```css
// ...
/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';

/* element默认主题 */
@import '~element-ui/packages/theme-chalk/src/index';
// ...
```

<br />vue3.0<br />

```css
// ...

/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-plus/lib/theme-chalk/fonts';

/* element默认主题 */
@import '~element-plus/packages/theme-chalk/src/index';

// ...
```

<a name="nHYt2"></a>

### js 内部引入 element-plus 组件

`src/utils/http.js`<br />
<br />vue2.0

```javascript
import axios from 'axios'
import { Message } from 'element-ui'

// ...
```

<br />vue3.0

```javascript
import axios from 'axios'
import { ElMessage } from 'element-plus'

// ...
```

<a name="tdyo6"></a>

### lang/index.js（国际化）

<br />vue2.0<br />

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
}

let i18n = {}

export function getI18n(locale) {
  const vueI18n = new VueI18n({
    locale: locale || Cookies.get('lang') || 'zh',
    messages,
  })
  /*eslint-disable*/
  i18n.__proto__ = vueI18n.__proto__
  i18n = Object.assign(i18n, vueI18n)
  return i18n
}

export default i18n
```

<br />vue3.0<br />

```javascript
// 1
import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
// 2
import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
import enLocale from './en'
import zhLocale from './zh'

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
}

let i18n = {}

export function getI18n(locale) {
  // 3
  const vueI18n = createI18n({
    locale: locale || Cookies.get('language') || 'zh',
    messages,
  })
  /*eslint-disable*/
  i18n.__proto__ = vueI18n.__proto__
  i18n = Object.assign(i18n, vueI18n)
  return i18n
}

export default messages
```

<a name="qmReD"></a>

### /deep/ 语法

vue2 中 覆盖子组件的方法有 /deep/ 、>>> 、::v-deep， 其中 ::v-deep 用法

```css
.parent {
  ::v-deep .child {
    /* ... */
  }
}
```

但是在 vue3 写法是不同的<br />

```css
.parent ::v-deep(.child) {
  /* ... */
}
```

<br />[参考文档](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)<br />

<a name="bgA7e"></a>

#### styles 文件内部全局 css

styles 文件夹内的全局样式其实是不需要 /deep/
<a name="zgeGG"></a>

#### scope style

```css
<style lang="scss" scoped>
</style>
```

<a name="5WIW1"></a>

## 问题记录

<a name="I5pbJ"></a>

### 问题 1

![/img/vue3/cli/1.png](/img/vue3/cli/1.png)
<br />/deep/ 与 >>> 已经废弃 需要是用 :deep(代替)<br />
<br />![/img/vue3/cli/2.png](/img/vue3/cli/2.png)<br />
<br />[参考文档](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles)<br />

<a name="WpsKm"></a>

### 问题 2

<a name="Ja8PY"></a>

### ![/img/vue3/cli/3.png](/img/vue3/cli/3.png)

<a name="SU6lc"></a>

### 问题 3

![/img/vue3/cli/4.png](/img/vue3/cli/4.png)<br />
<br />vue2.0<br />

```javascript
{ path: '*', redirect: '/404', hidden: true }
```

<br />vue3.0

```javascript
{
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
}
```

<br />

<a name="O3qrK"></a>

### 问题 4

![/img/vue3/cli/5.png](/img/vue3/cli/5.png)<br />
<br />![/img/vue3/cli/6.png](/img/vue3/cli/6.png)<br />
<br />![/img/vue3/cli/7.png](/img/vue3/cli/7.png)<br />

<a name="fCv3T"></a>

### 问题 5

![/img/vue3/cli/8.png](/img/vue3/cli/8.png)<br />
<br />修正后<br />![/img/vue3/cli/9.png](/img/vue3/cli/9.png)<br />

<a name="1Ij3Z"></a>

### 问题 6

slot => #slotName 或 v-slot="slotName"<br />

<a name="aDOuX"></a>

### 问题 7

error  '.native' modifier on 'v-on' directive is deprecated <br />

<a name="WksHW"></a>

### 问题 8

error  The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead <br />

<a name="lO5Yx"></a>

### 问题 9

warning  The "tab:change" event has been triggered but not declared on `emits` option  vue/require-explicit-emits<br />
<br />[https://v3.cn.vuejs.org/guide/migration/emits-option.html#\_2-x-behavior](https://v3.cn.vuejs.org/guide/migration/emits-option.html#_2-x-behavior)<br />
<br />
