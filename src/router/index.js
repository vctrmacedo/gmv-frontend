// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { getCookie } from "@/utils/cookies";
import Login from "../views/Login.vue";
import HomeView from "../views/HomeView.vue";
import UsersView from "../views/UsersView.vue";
import VehiclesView from '@/views/VehiclesView.vue';
import DriversView from "@/views/DriversView.vue";
import ScheduleView from "@/views/ScheduleView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  { path: "/home", name: "Home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/users", name: "Users", component: UsersView, meta: { requiresAuth: true } },
  { path: "/vehicles", name: "Veiculos", component: VehiclesView, meta: { requiresAuth: true } },
  { path: "/drivers", name: "Motoristas", component: DriversView, meta: { requiresAuth: true } },
  { path: "/schedules", name: "Agendamentos", component: ScheduleView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// auth guard
router.beforeEach((to, from, next) => {
  const isAuth = !!getCookie("auth_token");
  if (to.meta.requiresAuth && !isAuth) return next({ name: "Login" });
  if (to.name === "Login" && isAuth) return next({ name: "Home" });
  next();
});

export default router;