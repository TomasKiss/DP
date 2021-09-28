import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Namespaces from '../views/Namespaces.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/namespaces',
    name: 'Namespaces',
    component: Namespaces
  },
  // catchall 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
