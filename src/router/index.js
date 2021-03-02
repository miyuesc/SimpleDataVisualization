import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/Home.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
