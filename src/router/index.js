import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("/@/views/home/Home.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("/@/views/login/Login.vue")
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import("/@/views/editor/Editor.vue")
  },
  {
    path: "/preview",
    name: "Preview",
    component: () => import("/@/views/preview/Preview.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
