<template>
  <v-container class="py-8" fluid>
    <!-- HEADER HERO SECTION -->
    <div class="hero-section mb-8">
      <div class="hero-content text-center">
        <div class="hero-icon mb-4">
          <v-avatar size="80" class="gradient-primary elevation-8">
            <v-icon size="40" color="white">mdi-view-dashboard</v-icon>
          </v-avatar>
        </div>
        <h1 class="hero-title mb-3">Dashboard GMV</h1>
        <p class="hero-subtitle">
          Sistema Inteligente de Gerenciamento de Veículos e Motoristas
        </p>
        <div class="hero-stats mt-6">
          <v-chip 
            class="mx-2 status-chip status-active" 
            size="large"
            prepend-icon="mdi-shield-check"
          >
            Sistema Ativo
          </v-chip>
          <v-chip 
            class="mx-2 status-chip status-info" 
            size="large"
            prepend-icon="mdi-clock-check"
          >
            Última atualização: {{ new Date().toLocaleTimeString('pt-BR') }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- CARDS DE MÉTRICAS PRINCIPAIS -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <div class="metric-card gradient-users">
          <div class="metric-content">
            <div class="metric-icon">
              <v-icon size="40" color="white">mdi-account-group</v-icon>
            </div>
            <div class="metric-data">
              <div class="metric-number">{{ stats.totalUsers }}</div>
              <div class="metric-label">Usuários Totais</div>
              <div class="metric-badge">
                <v-chip size="x-small" color="white" variant="flat">
                  Sistema ativo
                </v-chip>
              </div>
            </div>
          </div>
          <div class="metric-decoration"></div>
        </div>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <div class="metric-card gradient-drivers">
          <div class="metric-content">
            <div class="metric-icon">
              <v-icon size="40" color="white">mdi-account-tie</v-icon>
            </div>
            <div class="metric-data">
              <div class="metric-number">{{ stats.totalDrivers }}</div>
              <div class="metric-label">Motoristas</div>
              <div class="metric-badge">
                <v-chip size="x-small" color="white" variant="flat">
                  {{ stats.activeDrivers }} ativos
                </v-chip>
              </div>
            </div>
          </div>
          <div class="metric-decoration"></div>
        </div>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <div class="metric-card gradient-vehicles">
          <div class="metric-content">
            <div class="metric-icon">
              <v-icon size="40" color="white">mdi-car</v-icon>
            </div>
            <div class="metric-data">
              <div class="metric-number">{{ stats.totalVehicles }}</div>
              <div class="metric-label">Veículos</div>
              <div class="metric-badge">
                <v-chip size="x-small" color="white" variant="flat">
                  {{ stats.activeVehicles }} disponíveis
                </v-chip>
              </div>
            </div>
          </div>
          <div class="metric-decoration"></div>
        </div>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <div class="metric-card gradient-schedules">
          <div class="metric-content">
            <div class="metric-icon">
              <v-icon size="40" color="white">mdi-calendar-clock</v-icon>
            </div>
            <div class="metric-data">
              <div class="metric-number">{{ stats.totalSchedules }}</div>
              <div class="metric-label">Agendamentos</div>
              <div class="metric-badge">
                <v-chip size="x-small" color="white" variant="flat">
                  {{ stats.schedulesToday }} hoje
                </v-chip>
              </div>
            </div>
          </div>
          <div class="metric-decoration"></div>
        </div>
      </v-col>
    </v-row>

    <!-- GRÁFICOS E DADOS DETALHADOS -->
    <v-row class="mb-8">
      <!-- STATUS DA FROTA -->
      <v-col cols="12" md="6">
        <div class="dashboard-card fleet-card">
          <div class="card-header">
            <div class="card-icon">
              <v-icon size="24" color="white">mdi-car-multiple</v-icon>
            </div>
            <div class="card-title">Status da Frota</div>
          </div>
          <div class="card-content">
            <div class="progress-item mb-6">
              <div class="progress-header">
                <div class="progress-info">
                  <v-icon size="18" color="success" class="mr-2">mdi-check-circle</v-icon>
                  <span class="progress-label">Veículos Ativos</span>
                </div>
                <div class="progress-value success">{{ stats.activeVehicles }}</div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar success" :style="{ width: stats.vehicleActivePercentage + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(stats.vehicleActivePercentage) }}% da frota</div>
            </div>
            
            <div class="progress-item mb-6">
              <div class="progress-header">
                <div class="progress-info">
                  <v-icon size="18" color="error" class="mr-2">mdi-close-circle</v-icon>
                  <span class="progress-label">Veículos Inativos</span>
                </div>
                <div class="progress-value error">{{ stats.inactiveVehicles }}</div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar error" :style="{ width: stats.vehicleInactivePercentage + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(stats.vehicleInactivePercentage) }}% da frota</div>
            </div>

            <div class="summary-card">
              <div class="summary-icon">
                <v-icon size="32" color="primary">mdi-speedometer</v-icon>
              </div>
              <div class="summary-content">
                <div class="summary-label">Quilometragem Média</div>
                <div class="summary-value">{{ formatNumber(stats.averageMileage) }} km</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- ALERTAS E NOTIFICAÇÕES -->
      <v-col cols="12" md="6">
        <div class="dashboard-card alerts-card">
          <div class="card-header">
            <div class="card-icon alerts">
              <v-icon size="24" color="white">mdi-alert-circle</v-icon>
            </div>
            <div class="card-title">Central de Alertas</div>
          </div>
          <div class="card-content">
            <!-- CNHs VENCENDO -->
            <div 
              v-if="alerts.expiredCNH.length > 0"
              class="alert-item error mb-4"
            >
              <div class="alert-header">
                <v-icon size="20" color="error">mdi-card-account-details-outline</v-icon>
                <span class="alert-title">CNHs Vencidas/Vencendo</span>
              </div>
              <div class="alert-content">
                <div v-for="driver in alerts.expiredCNH.slice(0, 3)" :key="driver.id" class="alert-item-detail">
                  {{ driver.name }} - {{ driver.daysToExpire > 0 ? `Vence em ${driver.daysToExpire} dias` : 'Vencida' }}
                </div>
                <div v-if="alerts.expiredCNH.length > 3" class="alert-more">
                  +{{ alerts.expiredCNH.length - 3 }} outros motoristas
                </div>
              </div>
            </div>

            <!-- VEÍCULOS ALTA QUILOMETRAGEM -->
            <div 
              v-if="alerts.highMileage.length > 0"
              class="alert-item warning mb-4"
            >
              <div class="alert-header">
                <v-icon size="20" color="warning">mdi-speedometer-slow</v-icon>
                <span class="alert-title">Alta Quilometragem</span>
              </div>
              <div class="alert-content">
                <div v-for="vehicle in alerts.highMileage.slice(0, 3)" :key="vehicle.id" class="alert-item-detail">
                  {{ vehicle.model }} ({{ vehicle.license_plate }}) - {{ formatNumber(vehicle.current_mileage) }} km
                </div>
                <div v-if="alerts.highMileage.length > 3" class="alert-more">
                  +{{ alerts.highMileage.length - 3 }} outros veículos
                </div>
              </div>
            </div>

            <!-- AGENDAMENTOS PRÓXIMOS -->
            <div 
              v-if="alerts.upcomingReturns.length > 0"
              class="alert-item info mb-4"
            >
              <div class="alert-header">
                <v-icon size="20" color="info">mdi-calendar-clock</v-icon>
                <span class="alert-title">Retornos Próximos</span>
              </div>
              <div class="alert-content">
                <div v-for="schedule in alerts.upcomingReturns.slice(0, 3)" :key="schedule.id" class="alert-item-detail">
                  {{ getDriverName(schedule.driver_id) }} - {{ formatDate(schedule.return_date) }}
                </div>
                <div v-if="alerts.upcomingReturns.length > 3" class="alert-more">
                  +{{ alerts.upcomingReturns.length - 3 }} outros retornos
                </div>
              </div>
            </div>

            <!-- SEM ALERTAS -->
            <div 
              v-if="!hasAlerts"
              class="no-alerts"
            >
              <div class="no-alerts-icon">
                <v-icon size="48" color="success">mdi-check-circle</v-icon>
              </div>
              <div class="no-alerts-text">
                <div class="no-alerts-title">Sistema em Ordem</div>
                <div class="no-alerts-subtitle">Nenhum alerta no momento</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- TABELAS RESUMIDAS -->
    <v-row class="mt-8">
      <!-- PRÓXIMOS AGENDAMENTOS -->
      <v-col cols="12" md="6">
        <div class="dashboard-card table-card">
          <div class="card-header">
            <div class="card-icon schedules">
              <v-icon size="24" color="white">mdi-calendar-today</v-icon>
            </div>
            <div class="card-title">Próximos Agendamentos</div>
            <v-btn size="small" variant="text" to="/schedules" class="header-action">
              Ver todos
              <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
          <div class="card-content" v-if="recentSchedules.length > 0">
            <div class="custom-table">
              <div class="table-header">
                <div class="table-col">Motorista</div>
                <div class="table-col">Veículo</div>
                <div class="table-col">Saída</div>
                <div class="table-col">Retorno</div>
              </div>
              <div class="table-body">
                <div v-for="schedule in recentSchedules.slice(0, 5)" :key="schedule.id" class="table-row">
                  <div class="table-col">{{ getDriverName(schedule.driver_id) }}</div>
                  <div class="table-col">{{ getVehicleModel(schedule.vehicle_id) }}</div>
                  <div class="table-col">{{ formatDate(schedule.departure_date) }}</div>
                  <div class="table-col">{{ formatDate(schedule.return_date) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <v-icon size="48" color="grey-lighten-1">mdi-calendar-remove</v-icon>
            <div class="empty-text">Nenhum agendamento encontrado</div>
          </div>
        </div>
      </v-col>

      <!-- VEÍCULOS DISPONÍVEIS -->
      <v-col cols="12" md="6">
        <div class="dashboard-card table-card">
          <div class="card-header">
            <div class="card-icon vehicles">
              <v-icon size="24" color="white">mdi-car-key</v-icon>
            </div>
            <div class="card-title">Veículos Disponíveis</div>
            <v-btn size="small" variant="text" to="/vehicles" class="header-action">
              Ver todos
              <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
          <div class="card-content" v-if="availableVehicles.length > 0">
            <div class="custom-table">
              <div class="table-header">
                <div class="table-col">Placa</div>
                <div class="table-col">Modelo</div>
                <div class="table-col">Ano</div>
                <div class="table-col text-right">KM</div>
              </div>
              <div class="table-body">
                <div v-for="vehicle in availableVehicles.slice(0, 5)" :key="vehicle.id" class="table-row">
                  <div class="table-col font-weight-bold">{{ vehicle.license_plate }}</div>
                  <div class="table-col">{{ vehicle.model }}</div>
                  <div class="table-col">{{ vehicle.year || 'N/A' }}</div>
                  <div class="table-col text-right">{{ formatNumber(vehicle.current_mileage) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <v-icon size="48" color="grey-lighten-1">mdi-car-off</v-icon>
            <div class="empty-text">Nenhum veículo disponível</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { listUsers } from "../services/users";
import { listDrivers } from "../services/drivers";
import { listVehicles } from "../services/vehicles";
import { fetchSchedules } from "../services/schedules";

export default {
  name: "HomeView",
  data() {
    return {
      loading: false,
      users: [],
      drivers: [],
      vehicles: [],
      schedules: [],
      stats: {
        totalUsers: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        totalVehicles: 0,
        activeVehicles: 0,
        inactiveVehicles: 0,
        vehicleActivePercentage: 0,
        vehicleInactivePercentage: 0,
        totalSchedules: 0,
        schedulesToday: 0,
        averageMileage: 0,
      },
      alerts: {
        expiredCNH: [],
        highMileage: [],
        upcomingReturns: [],
      },
      recentSchedules: [],
      availableVehicles: [],
    };
  },
  computed: {
    hasAlerts() {
      return this.alerts.expiredCNH.length === 0 && 
             this.alerts.highMileage.length === 0 && 
             this.alerts.upcomingReturns.length === 0;
    }
  },
  async created() {
    await this.loadAllData();
    this.calculateStats();
    this.generateAlerts();
  },
  methods: {
    async loadAllData() {
      this.loading = true;
      try {
        // Carrega todos os dados em paralelo
        const [usersRes, driversRes, vehiclesRes, schedulesRes] = await Promise.all([
          listUsers(),
          listDrivers(),
          listVehicles(),
          fetchSchedules()
        ]);

        this.users = usersRes.data;
        this.drivers = driversRes.data;
        this.vehicles = vehiclesRes.data;
        this.schedules = schedulesRes; // fetchSchedules já retorna array direto
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        this.loading = false;
      }
    },

    calculateStats() {
      // Estatísticas básicas
      this.stats.totalUsers = this.users.length;
      this.stats.totalDrivers = this.drivers.length;
      this.stats.activeDrivers = this.drivers.filter(d => d.active).length;
      this.stats.totalVehicles = this.vehicles.length;
      this.stats.activeVehicles = this.vehicles.filter(v => v.active).length;
      this.stats.inactiveVehicles = this.vehicles.filter(v => !v.active).length;
      this.stats.totalSchedules = this.schedules.length;

      // Percentuais
      if (this.stats.totalVehicles > 0) {
        this.stats.vehicleActivePercentage = (this.stats.activeVehicles / this.stats.totalVehicles) * 100;
        this.stats.vehicleInactivePercentage = (this.stats.inactiveVehicles / this.stats.totalVehicles) * 100;
      }

      // Agendamentos hoje
      const today = new Date().toISOString().split('T')[0];
      this.stats.schedulesToday = this.schedules.filter(s => 
        s.departure_date === today || s.return_date === today
      ).length;

      // Quilometragem média
      if (this.vehicles.length > 0) {
        const totalMileage = this.vehicles.reduce((sum, v) => sum + (v.current_mileage || 0), 0);
        this.stats.averageMileage = totalMileage / this.vehicles.length;
      }

      // Veículos disponíveis (ativos e não em uso)
      this.availableVehicles = this.vehicles.filter(v => v.active);

      // Agendamentos recentes/próximos
      this.recentSchedules = this.schedules
        .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date))
        .slice(0, 10);
    },

    generateAlerts() {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

      // CNHs vencendo em 30 dias
      this.alerts.expiredCNH = this.drivers
        .filter(driver => {
          if (!driver.cnh_validity) return false;
          const cnhDate = new Date(driver.cnh_validity);
          return cnhDate <= thirtyDaysFromNow;
        })
        .map(driver => ({
          ...driver,
          daysToExpire: Math.ceil((new Date(driver.cnh_validity) - today) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => a.daysToExpire - b.daysToExpire);

      // Veículos com alta quilometragem (acima de 100.000 km)
      this.alerts.highMileage = this.vehicles
        .filter(v => v.current_mileage > 100000)
        .sort((a, b) => b.current_mileage - a.current_mileage);

      // Retornos próximos (próximos 7 dias)
      const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
      this.alerts.upcomingReturns = this.schedules
        .filter(schedule => {
          if (!schedule.return_date) return false;
          const returnDate = new Date(schedule.return_date);
          return returnDate >= today && returnDate <= sevenDaysFromNow;
        })
        .sort((a, b) => new Date(a.return_date) - new Date(b.return_date));
    },

    getDriverName(driverId) {
      const driver = this.drivers.find(d => d.id === driverId);
      return driver ? driver.name : 'N/A';
    },

    getVehicleModel(vehicleId) {
      const vehicle = this.vehicles.find(v => v.id === vehicleId);
      return vehicle ? `${vehicle.model} (${vehicle.license_plate})` : 'N/A';
    },

    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    },

    formatNumber(num) {
      if (!num) return '0';
      return num.toLocaleString('pt-BR');
    }
  }
};
</script>

<style scoped>
/* ===== HERO SECTION ===== */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 48px 24px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.gradient-primary {
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
}

.hero-title {
  font-size: 3rem !important;
  font-weight: 700 !important;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.25rem !important;
  color: rgba(255,255,255,0.9);
  font-weight: 400;
}

.glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.2) !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
}

/* ===== STATUS CHIPS ===== */
.status-chip {
  font-weight: 600 !important;
  border: 2px solid rgba(255,255,255,0.3) !important;
  backdrop-filter: blur(15px) !important;
}

.status-chip.status-active {
  background: rgba(34, 197, 94, 0.9) !important;
  color: white !important;
}

.status-chip.status-active :deep(.v-icon) {
  color: white !important;
}

.status-chip.status-info {
  background: rgba(59, 130, 246, 0.9) !important;
  color: white !important;
}

.status-chip.status-info :deep(.v-icon) {
  color: white !important;
}

/* ===== METRIC CARDS ===== */
.metric-card {
  height: 180px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.gradient-users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-drivers {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-vehicles {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-schedules {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.metric-content {
  position: relative;
  z-index: 2;
  padding: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  color: white;
}

.metric-icon {
  margin-right: 20px;
  opacity: 0.9;
}

.metric-data {
  flex: 1;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 12px;
}

.metric-badge .v-chip {
  opacity: 0.9;
  font-size: 0.75rem;
}

.metric-decoration {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  z-index: 1;
}

/* ===== DASHBOARD CARDS ===== */
.dashboard-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.dashboard-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.alerts-card .card-header {
  background: linear-gradient(135deg, #ff7b7b 0%, #ff9f40 100%);
}

.card-header .card-icon {
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.card-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  flex: 1;
}

.header-action {
  color: white !important;
}

.card-content {
  padding: 24px;
}

/* ===== PROGRESS BARS ===== */
.progress-item {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  align-items: center;
}

.progress-label {
  font-weight: 500;
  color: #333;
}

.progress-value {
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.progress-value.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.progress-value.error {
  background: #ffebee;
  color: #d32f2f;
}

.progress-bar-container {
  height: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.progress-bar.success {
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.progress-bar.error {
  background: linear-gradient(90deg, #f44336, #ef5350);
}

.progress-percentage {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}

.summary-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
}

.summary-icon {
  margin-right: 16px;
}

.summary-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
}

/* ===== ALERTS ===== */
.alert-item {
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid;
}

.alert-item.error {
  background: #ffebee;
  border-left-color: #f44336;
}

.alert-item.warning {
  background: #fff8e1;
  border-left-color: #ff9800;
}

.alert-item.info {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.alert-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.alert-title {
  font-weight: 600;
  margin-left: 8px;
  color: #333;
}

.alert-item-detail {
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 4px;
  padding-left: 16px;
}

.alert-more {
  font-size: 0.75rem;
  color: #888;
  font-style: italic;
  padding-left: 16px;
  margin-top: 8px;
}

.no-alerts {
  text-align: center;
  padding: 32px 16px;
}

.no-alerts-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.no-alerts-subtitle {
  color: #666;
  font-size: 0.875rem;
}

/* ===== CUSTOM TABLES ===== */
.table-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-card .card-header .card-icon.schedules {
  background: rgba(255,255,255,0.2);
}

.table-card .card-header .card-icon.vehicles {
  background: rgba(255,255,255,0.2);
}

.custom-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 2px solid #f5f5f5;
  margin-bottom: 12px;
}

.table-header .table-col {
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.table-body {
  max-height: 300px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f9f9f9;
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  font-size: 0.875rem;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-col.text-right {
  text-align: right;
}

.table-col.font-weight-bold {
  font-weight: 600;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #999;
}

.empty-text {
  margin-top: 16px;
  font-size: 1rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .metric-number {
    font-size: 2rem;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .table-col:nth-child(3),
  .table-col:nth-child(4) {
    display: none;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.metric-card,
.dashboard-card {
  animation: fadeInUp 0.6s ease forwards;
}

.metric-card:nth-child(1) { animation-delay: 0.1s; }
.metric-card:nth-child(2) { animation-delay: 0.2s; }
.metric-card:nth-child(3) { animation-delay: 0.3s; }
.metric-card:nth-child(4) { animation-delay: 0.4s; }
</style>