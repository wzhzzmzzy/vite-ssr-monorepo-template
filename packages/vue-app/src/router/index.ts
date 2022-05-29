import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Home from '../views/home/index.vue'

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Home },
]

export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: (import.meta.env.SSR ? createMemoryHistory : createWebHistory)(),
  routes,
})
