import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Namespaces from '../views/Namespaces.vue'
import NotFound from '../views/NotFound.vue'
import InsertDataPage from "../views/InsertDataPage.vue";

const routes = [
  {
    path: "/r/:repo",
    name: "Home",
    component: Home,
  },
  {
    path: "/:repo/namespaces",
    name: "Namespaces",
    component: Namespaces,
  },
  {
    path: "/:repo/insert",
    name: "InsertDataPage",
    component: InsertDataPage,
  },
  // catchall 404
  {
    path: "/:repo/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
