// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import HomeView from "../views/HomeView.vue";
import UsersView from "../views/UsersView.vue";
import VehiclesView from '@/views/VehiclesView.vue';

// placeholders (você pode criar depois)
const VeiculosView = { template: '<v-container class="py-6"><h2>Veículos</h2></v-container>' }
const MotoristasView = { template: '<v-container class="py-6"><h2>Motoristas</h2></v-container>' }
const AgendamentosView = { template: '<v-container class="py-6"><h2>Agendamentos</h2></v-container>' }

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  { path: "/home", name: "Home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/users", name: "Users", component: UsersView, meta: { requiresAuth: true } },
  { path: "/vehicles", name: "Veiculos", component: VehiclesView, meta: { requiresAuth: true } },
  { path: "/motoristas", name: "Motoristas", component: MotoristasView, meta: { requiresAuth: true } },
  { path: "/agendamentos", name: "Agendamentos", component: AgendamentosView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// auth guard
router.beforeEach((to, from, next) => {
  const isAuth = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuth) return next({ name: "Login" });
  if (to.name === "Login" && isAuth) return next({ name: "Home" });
  next();
});

export default router;