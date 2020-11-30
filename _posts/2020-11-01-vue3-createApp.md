---
layout: post
title: 'vue3 源码分析步骤 及 createApp 方法分析'
date: '2020-11-01'
author: 'XuBaoshi'
header-img: 'img/post-bg-06.jpg'
---

# vue3 源码分析步骤 及 createApp 方法分析

## 前言

vue 3.0 相较于 vue2.0 主要针对 config api 改为 composition api、typescript 的支持、vue 的内部结构被重写成了一个个可以解耦的模块（允许编译后 tree-shaking），从而减小体积加快运行速度。

### Vue2 与 Vue3 的对比

- 对 TypeScript 支持不友好（所有属性都放在了 this 对象上，难以推倒组件的数据类型）
- 大量的 API 挂载在 Vue 对象的原型上，难以实现 TreeShaking。
- 架构层面对跨平台 dom 渲染开发支持不友好
- CompositionAPI。受 ReactHook 启发
- 更方便的支持了 jsx
- Vue 3 的 Template 支持多个根标签，Vue 2 不支持
- 对虚拟 DOM 进行了重写、对模板的编译进行了优化操作...

## v3.0 新特性介绍

### setup 函数

setup() 函数是 vue3 中，专门为组件提供的新属性。它为我们使用 vue3 的 Composition API 新特性提供了统一的入口, setup 函数会在 beforeCreate 之后、created 之前执行, vue3 也是取消了这两个钩子，统一用 setup 代替, 该函数相当于一个生命周期函数，vue 中过去的 data，methods，watch 等全部都用对应的新增 api 写在 setup()函数中

```javascript
setup(props, context) {
    context.attrs
    context.slots
    context.parent
    context.root
    context.emit
    context.refs

    return {

    }
  }
```

- props: 用来接收 props 数据
- context 用来定义上下文, 上下文对象中包含了一些有用的属性，这些属性在 vue 2.x 中需要通过 this 才能访问到, 在 setup() 函数中无法访问到 this，是个 undefined
- 返回值: return {}, 返回响应式数据, 模版中需要使用的函数

### reactive

reactive() 函数接收一个普通对象，返回一个响应式的数据对象, 想要使用创建的响应式数据也很简单，创建出来之后，在 setup 中 return 出去，直接在 template 中调用即可

```html
<template><div>{{name}}</div></template>
<script>
  import { reactive } from 'vue'
  export default {
    setup(props, context) {
      let state = reactive({
        name: 'test',
      })

      return state
    },
  }
</script>
```

### ref

ref() 函数用来根据给定的值创建一个响应式的数据对象，ref() 函数调用的返回值是一个对象，这个对象上只包含一个 value 属性, 只在 setup 函数内部访问 ref 函数需要加.value

```html
<template>
  <div class="mine">{{count}}</div>
</template>

<script>
  import { defineComponent, ref } from 'vue'
  export default {
    setup() {
      const count = ref(10)
      // 在js 中获取ref 中定义的值, 需要通过value属性
      console.log(count.value) // 10
      return {
        count,
      }
    },
  }
</script>
```

如果 ref 方法内部传入对象，其实底层还是调用的 reactive 方法。 ref、reactive 的具体还需要看场景。

```javascript
import {ref} from 'vue';
export default {
  name:'App'
  setup(){
    let obj = {name : 'alice', age : 12};
    let newObj= ref(obj.name);
    function change(){
      newObj.value = 'Tom';
      console.log(obj,newObj)
  	}
  return {newObj,change}
}
```

当 change 执行的时候，响应式数据发生改变，而原始数据 obj 并不会改变。
原因在于，ref 的本质是拷贝，与原始数据没有引用关系。

### toRef

使用 toRef 将某个对象中的属性变成响应式数据，修改响应式数据是会影响到原始数据的。但是需要注意，如果修改通过 toRef 创建的响应式数据，并不会触发 UI 界面的更新。

```javascript
import {toRef} from 'vue';
export default {
  name:'App'
  setup(){
    let obj = {name : 'alice', age : 12};
    let newObj= toRef(obj, 'name');
    function change(){
      newObj.value = 'Tom';
      console.log(obj,newObj)
    }
    return {newObj,change}
  }
}
```

### toRefs

有的时候，我们希望将对象的多个属性都变成响应式数据，并且要求响应式数据和原始数据关联，并且更新响应式数据的时候不更新界面，就可以使用 toRefs，用于批量设置多个数据为响应式数据。

```javascript
import {toRefs} from 'vue';
export default {
  name:'App'
  setup(){
    let obj = {name : 'alice', age : 12};
    let newObj= toRefs(obj);
    function change(){
      newObj.name.value = 'Tom';
      newObj.age.value = 18;
      console.log(obj,newObj)
    }
    return {newObj,change}
  }

```

### computed()

#### 只读的计算属性

```javascript
import { computed, ref } from 'vue';
export default {
  setup(props, context) {
    const age = ref(18)

    // 根据 age 的值，创建一个响应式的计算属性 readOnlyAge,它会根据依赖的 ref 自动计算并返回一个新的 ref
    const readOnlyAge = computed(() => age.value++) // 19

    return {
      age,
      readOnlyAge
    }
  }
}
</script>
```

#### 通过 set()、get()方法创建一个可读可写的计算属性

```javascript
import { computed, ref } from 'vue'
export default {
  setup(props, context) {
    const age = ref < number > 18

    const computedAge = computed({
      get: () => age.value + 1,
      set: (value) => age.value + value,
    })
    // 为计算属性赋值的操作，会触发 set 函数, 触发 set 函数后，age 的值会被更新
    age.value = 100
    return {
      age,
      computedAge,
    }
  },
}
```

### watch() 函数

#### 监听用 reactive 声明的数据源

```javascript
import { reactive, watch } from 'vue'
export default {
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    watch(
      () => state.age,
      (age, preAge) => {
        console.log(age) // 100
        console.log(preAge) // 10
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值
    state.age = 100
    return {
      ...state,
    }
  },
}
```

#### 监听用 ref 声明的数据源

```javascript
<script>
import { ref, watch } from 'vue';
export default defineComponent({
  setup(props, context) {
    const age = ref(10);

    watch(age, () => console.log(age.value)); // 100

    // 修改age 时会触发watch 的回调, 打印变更后的值
    age.value = 100
    return {
      age
    }
  }
});
</script>
```

#### 同时监听多个值

```javascript
import { reactive, watch } from 'vue'

export default {
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    watch(
      [() => state.age, () => state.name],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName)
        console.log(newAge)

        console.log(oldName)
        console.log(oldAge)
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'
    return {
      ...state,
    }
  },
}
```

#### stop 停止监听

```javascript
import { reactive, watch } from 'vue'
export default {
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    const stop = watch(
      [() => state.age, () => state.name],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName)
        console.log(newAge)

        console.log(oldName)
        console.log(oldAge)
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'

    setTimeout(() => {
      stop()
      // 此时修改时, 不会触发watch 回调
      state.age = 1000
      state.name = 'vue3-'
    }, 1000) // 1秒之后讲取消watch的监听

    return {
      ...state,
    }
  },
}
```

#### LifeCycle Hooks(新的生命后期)

```javascript
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  onUpdated,
} from 'vue'
export default {
  setup(props, context) {
    onBeforeMount(() => {
      console.log('beformounted!')
    })
    onMounted(() => {
      console.log('mounted!')
    })

    onBeforeUpdate(() => {
      console.log('beforupdated!')
    })
    onUpdated(() => {
      console.log('updated!')
    })

    onBeforeUnmount(() => {
      console.log('beforunmounted!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })

    onErrorCaptured(() => {
      console.log('errorCaptured!')
    })

    return {}
  },
}
```

### Suspense 组件

Suspense 组件用于在等待某个异步组件解析时显示后备内容，每当我们希望组件等待数据获取时(通常在异步 API 调用中)，我们都可以使用 Vue3 Composition API 制作异步组件。

- 在页面加载之前显示加载动画
- 显示占位符内容
- 处理延迟加载的图像

```html
<Suspense>
  <template #default>
    <article-info />
  </template>
  <template #fallback>
    <div>正在拼了命的加载…</div>
  </template>
</Suspense>
```

需要注意的是<article-info/>组件需要返回一个 Promise

```javascript
export default {
  name: 'AsyncComponent',
  setup() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ result: 'yuanxi' })
      }, 2000)
    })
  },
}
```

## 下载项目

[vue3.0 项目地址](https://github.com/vuejs/vue-next)

```shell
git clone https://github.com/vuejs/vue-next.git
```

## 如何调试源码

项目下载后打开项目

![/img/vue3/start/1.png](/img/vue3/start/1.png)

vue 项目主要包含 3 个文件夹： packages、scripts、test-tds

- packages 源码主目录 存放 vue 的核心代码
- scripts 脚本文件 主要用来编译打包
- test-tds 测试 ts 的文件

## packages 文件夹结构分析

![/img/vue3/start/2.png](/img/vue3/start/2.png)

- compiler-core 编译-vue 核心
- compiler-dom 编译-dom 部分（浏览器）
- compiler-sfc 编译-单文件组件
- compiler-ssr 编译-服务端渲染
- reactivity 响应式
- runtime-core 运行时核心 包含声明周期、vnode、watch 等
- runtime-dom 运行时 dom 相关 包含 createApp 实现等
- runtime-test 运行时测试代码
- server-renderer 服务端渲染代码
- shared 工具类等
- size-check 测试 vue 包大小体积使用
- template-explorer vue 内部的编译文件浏览工具
- vue vue 的主入口文件

## createApp 使用方法

vue3.0 中是用 createApp 方法生成 vue 实例，回顾下 vue 2.0 版本中是如何生成实例的

### vue 2.0

```javascript
// 方式一
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
})
// 方式二
const App = {
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
}
new Vue({
  // h 为 createElement 方法
  render: (h) => h(App),
}).$mount('#app')
```

### vue3.0

```javascript
const App = {
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
}
Vue.createApp(App).mount('#app')
```

## createApp 源码分析

createApp 的相关源码放置在 `/packages/runtime-dom/src/index.ts` 中

### createApp

```typescript
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container)
    container.removeAttribute('v-cloak')
    container.setAttribute('data-v-app', '')
    return proxy
  }

  return app
}) as CreateAppFunction<Element>
```

- 上述代码中 `ensureRenderer` 方法顾明思议确保 renderer 对象是否存在，如果没有则生成一个（调用 createRenderer），生成 app 实例对象

```javascript
function ensureRenderer() {
  return (
    renderer || ((renderer = createRenderer < Node), Element > rendererOptions)
  )
}
```

- 在 `__DEV__` 开发模式下, 在 app.config 对象上添加 `isNativeTag` 属性

```javascript
function injectNativeTagCheck(app: App) {
  // Inject `isNativeTag`
  // this is used for component name validation (dev only)
  Object.defineProperty(app.config, 'isNativeTag', {
    value: (tag: string) => isHTMLTag(tag) || isSVGTag(tag),
    writable: false,
  })
}
```

- 从 app 对象中解构 mount 方法暂存，然后重写 `app.mount`
- - 调用 normalizeContainer 方法获取根元素容器（'#app'）
- - 判断 template 获取需要渲染的模板
- - 把根元素的 innerHTML 置空 清除根元素
- - 调用缓存中的 mount 方法，参数为 normalizeContainer 方法返回的跟容器
    ```javascript
    // normalizeContainer，获取元素
    function normalizeContainer(container: Element | string): Element | null {
      if (isString(container)) {
        return document.querySelector(container)
      }
      return container
    }
    ```
- - 删除 [v-cloak](https://cn.vuejs.org/v2/api/#v-cloak) 属性并添加 data-v-app 属性
- - 返回 mount 方法的执行结果
- 返回 app 实例

### createRenderer

createApp 方法中调用 createRenderer 方法获取 renderer 对象

```
// packages/runtime-core/src/renderer.ts
export function createRenderer<HostNode = RendererNode,
    HostElement = RendererElement>(options: RendererOptions<HostNode, HostElement>) {
    return baseCreateRenderer<HostNode, HostElement>(options)
}
```

createRenderer 方法接受 RendererOptions 作为参数并调用 baseCreateRenderer 方法。

```javascript
// packages/runtime-core/src/renderer.ts
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // ......

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate),
  }
}
```

baseCreateRenderer 内部包含大量的变量声明 最后该方法返回的是 render 方法、hydate 方法、createApp 方法，同时 createApp 方法则通过 createAppAPI 获取。

```javascript
// packages/runtime-core/src/apiCreateApp.ts
export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      isCustomElement: NO,
      errorHandler: undefined,
      warnHandler: undefined
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  }
}

export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  // createApp 方法中 rootComponent 代表根组件， rootProps 方法为该组件所传递的参数。
  return function createApp(rootComponent, rootProps = null) {
    // 校验 root props
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }
    // 调用 createAppContext 方法暂存到 context 中
    const context = createAppContext()
    // 存储已经安装过的插件
    const installedPlugins = new Set()

    // isMounted 设为 false
    let isMounted = false
    // 创建 app，挂载属性和函数
    const app: App = (context.app = {
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,

      version,

      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },
      use() {
        // ...
      },
      mixin() {
        // ...
      },
      component() {
        // ...
      },
      directive() {
        // ...
      },
      mount() {
        // ...
      },
      unmount() {
        // ...
      },
      provide() {
        // ...
      }
    })
    return app
  }
}
```

createAppAPI 方法直接返回 createApp 函数， createApp 方法中 rootComponent 代表根组件， rootProps 方法为该组件所传递的参数。

- 校验 root props
- 调用 createAppContext 方法暂存到 context 中
- 创建变量 installedPlugins，Set 类型，存储已经安装过的插件
- isMounted 设为 false
- 创建 app，挂载属性和函数
- 返回 app

![/img/vue3/start/3.png](/img/vue3/start/3.png)

此时的 app 为后面的 mount 方法准备所需要用到的函数。

最核心(繁琐)的操作都在 mount 里面,这里面包括 Vnode，render，patch 等等所有的核心功能。
