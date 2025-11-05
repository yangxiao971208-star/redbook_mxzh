import './style.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import MyCollection from './pages/MyCollection.vue'

// 路由配置
const routes = [
  { path: '/', component: Home },
  { path: '/collection', component: MyCollection }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建并挂载Vue应用
const app = createApp(App)
app.use(router)
app.mount('#app')