<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

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
  localStorage.removeItem("token");
  router.push({ name: "Login" });
}
</script>

<template>
  <v-app>
    <template v-if="showShell">
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-toolbar-title>🚗 Gestão de Motoristas e Veículos 🚗</v-toolbar-title>
        <v-spacer />
        <v-btn icon title="Sair" @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" app :rail="$vuetify.display.mdAndDown" expand-on-hover>
        <v-list nav density="compact">
          <v-list-subheader class="text-disabled">Navegação</v-list-subheader>
          <v-list-item
            v-for="(it, i) in items"
            :key="i"
            :to="it.to"
            link
            :prepend-icon="it.icon"
            :active="route.name === it.to.name"
          >
            <v-list-item-title>{{ it.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>
    </template>

    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>