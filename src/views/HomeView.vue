<template>
  <v-container class="py-6">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Home - Sistema GMV</h1>
      <p></p>
      <h1 class="text-h4 font-weight-bold mb-2">DASHBOARD</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Bem-vindo ao Sistema de Gerenciamento de Veículos e Motoristas
      </p>
    </div>

    <!-- CARDS DE MÉTRICAS PRINCIPAIS -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <v-avatar size="64" color="primary" class="mb-3">
                <v-icon size="32" color="white">mdi-account-group</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-primary mb-1">{{ stats.totalUsers }}</div>
              <div class="text-subtitle-1 text-medium-emphasis mb-2">Usuários Totais</div>
              <v-chip size="small" color="primary" variant="tonal">
                Sistema ativo
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <v-avatar size="64" color="success" class="mb-3">
                <v-icon size="32" color="white">mdi-account-tie</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-success mb-1">{{ stats.totalDrivers }}</div>
              <div class="text-subtitle-1 text-medium-emphasis mb-2">Motoristas</div>
              <v-chip size="small" color="success" variant="tonal">
                {{ stats.activeDrivers }} ativos
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <v-avatar size="64" color="info" class="mb-3">
                <v-icon size="32" color="white">mdi-car</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-info mb-1">{{ stats.totalVehicles }}</div>
              <div class="text-subtitle-1 text-medium-emphasis mb-2">Veículos</div>
              <v-chip size="small" color="info" variant="tonal">
                {{ stats.activeVehicles }} disponíveis
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" class="h-100">
          <v-card-text class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <v-avatar size="64" color="warning" class="mb-3">
                <v-icon size="32" color="white">mdi-calendar-clock</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-warning mb-1">{{ stats.totalSchedules }}</div>
              <div class="text-subtitle-1 text-medium-emphasis mb-2">Agendamentos</div>
              <v-chip size="small" color="warning" variant="tonal">
                {{ stats.schedulesToday }} hoje
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- GRÁFICOS E DADOS DETALHADOS -->
    <v-row>
      <!-- STATUS DA FROTA -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100">
          <v-card-title class="d-flex align-center bg-primary text-white">
            <v-icon class="mr-2">mdi-car-multiple</v-icon>
            Status da Frota
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="mb-6">
              <div class="d-flex justify-space-between align-center mb-3">
                <div class="d-flex align-center">
                  <v-icon size="20" color="success" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-subtitle-1">Veículos Ativos</span>
                </div>
                <v-chip color="success" size="small">{{ stats.activeVehicles }}</v-chip>
              </div>
              <v-progress-linear 
                :model-value="stats.vehicleActivePercentage" 
                color="success" 
                height="12" 
                rounded
                class="mb-1"
              />
              <div class="text-caption text-medium-emphasis text-right">
                {{ Math.round(stats.vehicleActivePercentage) }}% da frota
              </div>
            </div>
            
            <div class="mb-6">
              <div class="d-flex justify-space-between align-center mb-3">
                <div class="d-flex align-center">
                  <v-icon size="20" color="error" class="mr-2">mdi-close-circle</v-icon>
                  <span class="text-subtitle-1">Veículos Inativos</span>
                </div>
                <v-chip color="error" size="small">{{ stats.inactiveVehicles }}</v-chip>
              </div>
              <v-progress-linear 
                :model-value="stats.vehicleInactivePercentage" 
                color="error" 
                height="12" 
                rounded
                class="mb-1"
              />
              <div class="text-caption text-medium-emphasis text-right">
                {{ Math.round(stats.vehicleInactivePercentage) }}% da frota
              </div>
            </div>

            <v-divider class="my-4" />
            
            <div class="text-center pa-4 bg-grey-lighten-5 rounded">
              <v-icon size="32" color="primary" class="mb-2">mdi-speedometer</v-icon>
              <div class="text-subtitle-1 mb-1">Quilometragem Média</div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ formatNumber(stats.averageMileage) }} km
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ALERTAS E NOTIFICAÇÕES -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100">
          <v-card-title class="d-flex align-center bg-warning text-white">
            <v-icon class="mr-2">mdi-alert-circle</v-icon>
            Alertas Importantes
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- CNHs VENCENDO -->
            <v-alert 
              v-if="alerts.expiredCNH.length > 0"
              type="error" 
              variant="tonal" 
              class="mb-4"
              prominent
            >
              <template #prepend>
                <v-icon>mdi-card-account-details-outline</v-icon>
              </template>
              <div class="font-weight-bold mb-2">CNHs Vencidas/Vencendo</div>
              <div v-for="driver in alerts.expiredCNH.slice(0, 3)" :key="driver.id" class="text-body-2 mb-1">
                • {{ driver.name }} - {{ driver.daysToExpire > 0 ? `Vence em ${driver.daysToExpire} dias` : 'Vencida' }}
              </div>
              <div v-if="alerts.expiredCNH.length > 3" class="text-caption text-medium-emphasis">
                +{{ alerts.expiredCNH.length - 3 }} outros motoristas
              </div>
            </v-alert>

            <!-- VEÍCULOS ALTA QUILOMETRAGEM -->
            <v-alert 
              v-if="alerts.highMileage.length > 0"
              type="warning" 
              variant="tonal" 
              class="mb-4"
              prominent
            >
              <template #prepend>
                <v-icon>mdi-speedometer-slow</v-icon>
              </template>
              <div class="font-weight-bold mb-2">Veículos com Alta Quilometragem</div>
              <div v-for="vehicle in alerts.highMileage.slice(0, 3)" :key="vehicle.id" class="text-body-2 mb-1">
                • {{ vehicle.model }} ({{ vehicle.license_plate }}) - {{ formatNumber(vehicle.current_mileage) }} km
              </div>
              <div v-if="alerts.highMileage.length > 3" class="text-caption text-medium-emphasis">
                +{{ alerts.highMileage.length - 3 }} outros veículos
              </div>
            </v-alert>

            <!-- AGENDAMENTOS PRÓXIMOS -->
            <v-alert 
              v-if="alerts.upcomingReturns.length > 0"
              type="info" 
              variant="tonal"
              prominent
            >
              <template #prepend>
                <v-icon>mdi-calendar-clock</v-icon>
              </template>
              <div class="font-weight-bold mb-2">Retornos Próximos</div>
              <div v-for="schedule in alerts.upcomingReturns.slice(0, 3)" :key="schedule.id" class="text-body-2 mb-1">
                • {{ getDriverName(schedule.driver_id) }} - {{ formatDate(schedule.return_date) }}
              </div>
              <div v-if="alerts.upcomingReturns.length > 3" class="text-caption text-medium-emphasis">
                +{{ alerts.upcomingReturns.length - 3 }} outros retornos
              </div>
            </v-alert>

            <!-- SEM ALERTAS -->
            <v-alert 
              v-if="!hasAlerts"
              type="success" 
              variant="tonal"
              prominent
            >
              <template #prepend>
                <v-icon>mdi-check-circle</v-icon>
              </template>
              <div class="text-center">
                <div class="font-weight-bold mb-1">Tudo em ordem!</div>
                <div class="text-body-2">Nenhum alerta no momento</div>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- TABELAS RESUMIDAS -->
    <v-row class="mt-6">
      <!-- PRÓXIMOS AGENDAMENTOS -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-calendar-today</v-icon>
              Próximos Agendamentos
            </div>
            <v-btn size="small" variant="text" to="/schedules">Ver todos</v-btn>
          </v-card-title>
          <v-card-text v-if="recentSchedules.length > 0" class="pa-0">
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Motorista</th>
                  <th class="text-left">Veículo</th>
                  <th class="text-left">Saída</th>
                  <th class="text-left">Retorno</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in recentSchedules.slice(0, 5)" :key="schedule.id">
                  <td class="text-body-2">{{ getDriverName(schedule.driver_id) }}</td>
                  <td class="text-body-2">{{ getVehicleModel(schedule.vehicle_id) }}</td>
                  <td class="text-body-2">{{ formatDate(schedule.departure_date) }}</td>
                  <td class="text-body-2">{{ formatDate(schedule.return_date) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-text v-else>
            <div class="text-center py-8 text-medium-emphasis">
              <v-icon size="48" class="mb-2">mdi-calendar-remove</v-icon>
              <div>Nenhum agendamento encontrado</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- VEÍCULOS DISPONÍVEIS -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-car-key</v-icon>
              Veículos Disponíveis
            </div>
            <v-btn size="small" variant="text" to="/vehicles">Ver todos</v-btn>
          </v-card-title>
          <v-card-text v-if="availableVehicles.length > 0" class="pa-0">
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Placa</th>
                  <th class="text-left">Modelo</th>
                  <th class="text-left">Ano</th>
                  <th class="text-right">KM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vehicle in availableVehicles.slice(0, 5)" :key="vehicle.id">
                  <td class="text-body-2 font-weight-bold">{{ vehicle.license_plate }}</td>
                  <td class="text-body-2">{{ vehicle.model }}</td>
                  <td class="text-body-2">{{ vehicle.year || 'N/A' }}</td>
                  <td class="text-body-2 text-right">{{ formatNumber(vehicle.current_mileage) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-text v-else>
            <div class="text-center py-8 text-medium-emphasis">
              <v-icon size="48" class="mb-2">mdi-car-off</v-icon>
              <div>Nenhum veículo disponível</div>
            </div>
          </v-card-text>
        </v-card>
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

