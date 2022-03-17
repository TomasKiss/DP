import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NamespacesPage from "../views/NamespacesPage.vue";
import NotFound from "../views/NotFound.vue";
import InsertDataPage from "../views/InsertDataPage.vue";
import SavedQueriesPage from "../views/SavedQueriesPage.vue";

const routes = [
  {
    path: "/r/:repo/:name?/:do?",
    name: "Home",
    component: Home,
  },
  {
    path: "/r/:repo/namespaces",
    name: "NamespacesPage",
    component: NamespacesPage,
  },
  {
    path: "/r/:repo/insert",
    name: "InsertDataPage",
    component: InsertDataPage,
  },
  {
    path: "/r/:repo/saved_queries",
    name: "SavedQueriesPage",
    component: SavedQueriesPage,
  },
  // catchall 404
  {
    path: "/r/:repo/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
