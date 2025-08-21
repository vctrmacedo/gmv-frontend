<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { removeCookie } from "@/utils/cookies";

const drawer = ref(true);
const route = useRoute();
const router = useRouter();

const showShell = computed(() => route.name !== "Login");

const items = [
  { title: "Home", to: { name: "Home" }, icon: "mdi-home-outline" },
  { title: "Usuários", to: { name: "Users" }, icon: "mdi-account-cog-outline" },
  { title: "Veículos", to: { name: "Veiculos" }, icon: "mdi-car-outline" },
  { title: "Motoristas", to: { name: "Motoristas" }, icon: "mdi-account-outline" },
  { title: "Agendamentos", to: { name: "Agendamentos" }, icon: "mdi-calendar-clock" },
];

function logout() {
  removeCookie("auth_token");
  router.push({ name: "Login" });
}
</script>

<template>
  <v-app>
    <template v-if="showShell">
      <!-- TOP BAR -->
      <div class="top-bar">
        <div class="top-bar-content">
          <div class="brand-section">
            <v-btn 
              icon 
              variant="text" 
              @click="drawer = !drawer"
              class="menu-btn"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <div class="brand">
              <v-avatar size="40" class="brand-logo">
                <v-icon size="24" color="white">mdi-car-multiple</v-icon>
              </v-avatar>
              <div class="brand-text">
                <div class="brand-title">Sistema GMV</div>
                <div class="brand-subtitle">Gestão Inteligente</div>
              </div>
            </div>
          </div>
          
          <div class="user-section">
            <v-btn 
              class="logout-btn"
              @click="logout"
              prepend-icon="mdi-logout"
              variant="tonal"
            >
              Sair
            </v-btn>
          </div>
        </div>
      </div>

      <!-- NAVIGATION DRAWER -->
      <v-navigation-drawer 
        v-model="drawer" 
        app 
        :rail="$vuetify.display.mdAndDown" 
        expand-on-hover
        class="custom-drawer"
      >
        <div class="drawer-content">
          <div class="drawer-header">
            <div class="user-avatar">
              <v-avatar size="48" class="gradient-primary">
                <v-icon size="24" color="white">mdi-account</v-icon>
              </v-avatar>
            </div>
            <div class="user-info" v-if="!($vuetify.display.mdAndDown && !drawer)">
              <div class="user-name">Administrador</div>
              <div class="user-role">Sistema GMV</div>
            </div>
          </div>

          <div class="nav-section">
            <div class="nav-title" v-if="!($vuetify.display.mdAndDown && !drawer)">
              Navegação
            </div>
            <div class="nav-items">
              <router-link
                v-for="(item, i) in items"
                :key="i"
                :to="item.to"
                class="nav-item"
                :class="{ active: route.name === item.to.name }"
              >
                <div class="nav-item-content">
                  <v-icon class="nav-icon" :color="route.name === item.to.name ? 'white' : 'primary'">
                    {{ item.icon }}
                  </v-icon>
                  <span class="nav-text" v-if="!($vuetify.display.mdAndDown && !drawer)">
                    {{ item.title }}
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </v-navigation-drawer>

      <v-main class="custom-main">
        <router-view />
      </v-main>
    </template>

    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<style scoped>
/* ===== TOP BAR ===== */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  z-index: 1005;
}

.top-bar-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  color: white !important;
  margin-right: 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.3)) !important;
}

.brand-text {
  color: white;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.brand-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  line-height: 1;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-btn {
  background: rgba(255,255,255,0.1) !important;
  color: white !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
  border-radius: 12px !important;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2) !important;
}

/* ===== CUSTOM DRAWER ===== */
.custom-drawer {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%) !important;
  border-right: 1px solid #e5e7eb !important;
  margin-top: 70px !important;
  height: calc(100vh - 70px) !important;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gradient-primary {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.2;
}

.nav-section {
  flex: 1;
  padding: 20px 0;
}

.nav-title {
  padding: 0 20px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item.active:before {
  opacity: 1;
}

.nav-item:hover:not(.active) {
  background: rgba(102, 126, 234, 0.05);
}

.nav-item-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
}

.nav-icon {
  transition: color 0.3s ease;
}

.nav-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  transition: color 0.3s ease;
}

.nav-item.active .nav-text {
  color: white;
  font-weight: 600;
}

/* ===== MAIN CONTENT ===== */
.custom-main {
  margin-top: 70px !important;
  background: #f8fafc !important;
  min-height: calc(100vh - 70px) !important;
}

.custom-main :deep(.v-main__wrap) {
  padding: 0 !important;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .top-bar-content {
    padding: 0 16px;
  }
  
  .brand-text {
    display: none;
  }
  
  .brand-subtitle {
    display: none;
  }
  
  .drawer-header {
    padding: 20px 16px;
  }
  
  .nav-items {
    padding: 0 8px;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item {
  animation: slideIn 0.3s ease-out;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.15s; }
.nav-item:nth-child(3) { animation-delay: 0.2s; }
.nav-item:nth-child(4) { animation-delay: 0.25s; }
.nav-item:nth-child(5) { animation-delay: 0.3s; }
</style>