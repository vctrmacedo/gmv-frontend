<template>
  <v-container
    class="fill-height d-flex align-center justify-center"
    style="background: linear-gradient(135deg, #ece9e6, #ffffff);"
  >
    <v-card elevation="12" rounded max-width="400" class="pa-8 text-center">
      <v-card-title class="text-h5 mb-6">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="usernameOrEmail"
            label="Email ou Nome de Usuário"
            prepend-icon="mdi-account"
            outlined
            dense
            required
            class="mb-4"
          />
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            prepend-icon="mdi-lock"
            outlined
            dense
            required
            class="mb-6"
          />
          <v-btn type="submit" color="primary" block large>Entrar</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4 justify-center">
        <span class="text-caption grey--text">
          Não possui conta? Entre em contato com o administrador
        </span>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      usernameOrEmail: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:8000/auth/login", {
          username_or_email: this.usernameOrEmail,
          password: this.password,
        });

        // Guardar token no localStorage
        localStorage.setItem("token", response.data.access_token);

        // Redirecionar para Home
        this.$router.push("/home");
      } catch (error) {
        alert("Credenciais inválidas!");
      }
    },
  },
};
</script>

<style scoped>
/* Pequeno ajuste de fonte e alinhamento */
.v-card-title {
  font-weight: 600;
}
</style>
