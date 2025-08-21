<template>
  <div class="login-container">
    <div class="login-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <v-avatar size="80" class="gradient-primary elevation-8 mb-4">
              <v-icon size="40" color="white">mdi-car-multiple</v-icon>
            </v-avatar>
          </div>
          <h1 class="login-title">Sistema GMV</h1>
          <p class="login-subtitle">Gerenciamento de Veículos e Motoristas</p>
        </div>

        <div class="login-form">
          <v-form @submit.prevent="handleLogin">
            <div class="form-group">
              <v-text-field
                v-model="usernameOrEmail"
                label="Email ou Nome de Usuário"
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-account"
                class="custom-input"
              />
            </div>

            <div class="form-group">
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-lock"
                class="custom-input"
              />
            </div>

            <v-btn 
              type="submit" 
              class="login-button"
              size="large"
              block
            >
              <v-icon class="mr-2">mdi-login</v-icon>
              Entrar no Sistema
            </v-btn>
          </v-form>
        </div>

        <div class="login-footer">
          <p class="footer-text">
            <v-icon size="16" class="mr-1">mdi-shield-check</v-icon>
            Acesso seguro e protegido
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setCookie } from "@/utils/cookies";

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

        // Guardar token em cookie seguro
        setCookie("auth_token", response.data.access_token, 7, {
          secure: process.env.NODE_ENV === 'production', // HTTPS em produção
          sameSite: 'Strict' // Proteção CSRF
        });

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
.login-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.gradient-primary {
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.custom-input :deep(.v-field) {
  border-radius: 16px;
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field):hover {
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
}

.custom-input :deep(.v-field--focused) {
  border-color: #667eea;
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.2);
}

.custom-input :deep(.v-field__input) {
  font-size: 1rem;
}

.custom-input :deep(.v-field__prepend-inner) .v-icon {
  color: #667eea;
  margin-right: 12px;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-radius: 16px !important;
  height: 56px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  color: white !important;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4) !important;
}

.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.footer-text {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
    margin: 20px;
  }
  
  .login-title {
    font-size: 2rem;
  }
  
  .shape {
    display: none;
  }
}
</style>

<style scoped>
/* Pequeno ajuste de fonte e alinhamento */
.v-card-title {
  font-weight: 600;
}
</style>
