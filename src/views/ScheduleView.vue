<template>
  <div class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <v-avatar size="60" class="gradient-schedules elevation-4">
            <v-icon size="30" color="white">mdi-calendar-clock</v-icon>
          </v-avatar>
        </div>
        <div class="header-text">
          <h1 class="page-title">Gerenciar Agendamentos</h1>
          <p class="page-subtitle">Controle completo de agendamentos de viagens</p>
        </div>
      </div>
    </div>

    <!-- ALERT DE ERRO -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="custom-alert mb-6"
      closable
      @click:close="errorMessage = ''"
    >
      <template #prepend>
        <v-icon>mdi-alert-circle</v-icon>
      </template>
      {{ errorMessage }}
    </v-alert>

    <!-- FORM DE CRIAÇÃO -->
    <div class="creation-card mb-8">
      <div class="card-header">
        <div class="card-icon">
          <v-icon size="24" color="white">mdi-calendar-plus</v-icon>
        </div>
        <div class="card-title">Criar Novo Agendamento</div>
      </div>
      <div class="card-content">
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row class="form-row">
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Motorista</label>
                <v-select
                  v-model="createForm.driver_id"
                  :items="drivers"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Veículo</label>
                <v-select
                  v-model="createForm.vehicle_id"
                  :items="vehicles"
                  item-value="id"
                  item-title="model"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Data de Saída</label>
                <v-menu
                  v-model="departureMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="createForm.departure_date"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      hide-details="auto"
                      class="custom-input"
                      :rules="[rules.required]"
                    />
                  </template>
                  <v-date-picker
                    v-model="createForm.departure_date"
                    @update:model-value="departureMenu = false"
                    :first-day-of-week="1"
                  />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Data de Retorno</label>
                <v-menu
                  v-model="returnMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="createForm.return_date"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      hide-details="auto"
                      class="custom-input"
                      :rules="[rules.required]"
                    />
                  </template>
                  <v-date-picker
                    v-model="createForm.return_date"
                    @update:model-value="returnMenu = false"
                    :first-day-of-week="1"
                  />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="form-group">
                <label class="form-label">Origem</label>
                <v-text-field
                  v-model="createForm.origin"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="form-group">
                <label class="form-label">Destino</label>
                <v-text-field
                  v-model="createForm.destination"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="form-group">
                <label class="form-label">Propósito</label>
                <v-text-field
                  v-model="createForm.purpose"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
          </v-row>
          <div class="form-actions">
            <v-btn type="submit" class="action-button primary">
              <v-icon class="mr-2">mdi-plus</v-icon>
              Criar Agendamento
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
    <!-- TABELA DE AGENDAMENTOS -->
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">
          <v-icon class="mr-2">mdi-calendar-multiple</v-icon>
          Lista de Agendamentos
        </h2>
        <div class="table-search">
          <v-text-field
            v-model="search"
            variant="outlined"
            placeholder="Buscar agendamentos..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            class="search-input"
          />
        </div>
      </div>
      
      <div class="table-content">
        <v-data-table
          :headers="headers"
          :items="schedules"
          :loading="loading"
          :search="search"
          :items-per-page="10"
          :items-per-page-options="[5, 10, 25, 50, 100]"
          show-current-page
          class="custom-table"
        >
          <template #item.driver_id="{ item }">
            <div class="driver-badge">
              <v-icon size="16" color="primary">mdi-account</v-icon>
              {{ getDriverName(item.driver_id) }}
            </div>
          </template>
          
          <template #item.vehicle_id="{ item }">
            <div class="vehicle-badge">
              <v-icon size="16" color="info">mdi-car</v-icon>
              {{ getVehicleModel(item.vehicle_id) }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="action-buttons">
              <v-btn size="small" variant="text" @click="openEdit(item)" class="action-btn edit">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn size="small" variant="text" @click="openDelete(item)" class="action-btn delete">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <template #no-data>
            <div class="no-data">
              <v-icon size="48" color="grey-lighten-1">mdi-calendar-off</v-icon>
              <div class="no-data-text">Nenhum agendamento encontrado</div>
              <div class="no-data-subtext">Crie seu primeiro agendamento usando o formulário acima</div>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="800" class="custom-dialog">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <h3 class="dialog-title">Editar Agendamento</h3>
          <v-btn
            icon
            variant="text"
            class="close-btn"
            @click="editDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="dialog-content">
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-row>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Motorista</label>
                  <v-select
                    v-model="editForm.driver_id"
                    :items="drivers"
                    item-value="id"
                    item-title="name"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Veículo</label>
                  <v-select
                    v-model="editForm.vehicle_id"
                    :items="vehicles"
                    item-value="id"
                    item-title="model"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Data de Saída</label>
                  <v-menu
                    v-model="departureMenuEdit"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-model="editForm.departure_date"
                        readonly
                        v-bind="props"
                        variant="outlined"
                        hide-details="auto"
                        class="custom-input"
                        :rules="[rules.required]"
                      />
                    </template>
                    <v-date-picker
                      v-model="editForm.departure_date"
                      @update:model-value="departureMenuEdit = false"
                      :first-day-of-week="1"
                    />
                  </v-menu>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Data de Retorno</label>
                  <v-menu
                    v-model="returnMenuEdit"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-model="editForm.return_date"
                        readonly
                        v-bind="props"
                        variant="outlined"
                        hide-details="auto"
                        class="custom-input"
                        :rules="[rules.required]"
                      />
                    </template>
                    <v-date-picker
                      v-model="editForm.return_date"
                      @update:model-value="returnMenuEdit = false"
                      :first-day-of-week="1"
                    />
                  </v-menu>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Origem</label>
                  <v-text-field
                    v-model="editForm.origin"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Destino</label>
                  <v-text-field
                    v-model="editForm.destination"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="dialog-actions">
          <v-btn
            variant="text"
            class="cancel-btn"
            @click="editDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="save-btn"
            @click="onUpdate"
            :loading="loading"
          >
            <v-icon left size="18">mdi-content-save</v-icon>
            Salvar Alterações
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR -->
    <v-dialog v-model="deleteDialog" max-width="480" class="custom-dialog delete-dialog">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <div class="delete-icon">
            <v-icon size="32" color="error">mdi-alert-circle</v-icon>
          </div>
          <h3 class="dialog-title">Confirmar Exclusão</h3>
          <p class="delete-message">Tem certeza que deseja excluir este agendamento?</p>
          <p class="delete-warning">Esta ação não pode ser desfeita.</p>
        </div>
        <div class="dialog-actions">
          <v-btn
            variant="text"
            class="cancel-btn"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="delete-btn"
            @click="onDelete"
            :loading="loading"
          >
            <v-icon left size="18">mdi-delete</v-icon>
            Excluir
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      class="custom-snackbar"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from "../services/schedules";
import { listDrivers } from "../services/drivers";
import { listVehicles } from "../services/vehicles";

export default {
  name: "SchedulesView",
  data() {
    return {
      loading: false,
      schedules: [],
      drivers: [],
      vehicles: [],
      errorMessage: "",
      search: "", // Campo de busca
      headers: [
        { title: "ID", key: "id", sortable: true },
        { title: "Motorista", key: "driver_id" },
        { title: "Veículo", key: "vehicle_id" },
        { title: "Saída", key: "departure_date" },
        { title: "Retorno", key: "return_date" },
        { title: "Origem", key: "origin" },
        { title: "Destino", key: "destination" },
        { title: "Ações", key: "actions", sortable: false, align: "end" },
      ],
      createForm: {
        driver_id: null,
        vehicle_id: null,
        departure_date: null,
        return_date: null,
        origin: "",
        destination: "",
        km_initial: 0,
        km_final: 0,
        liters_fuel: 0,
        fuel_cost: 0,
        observations: "",
      },
      editDialog: false,
      editForm: {},
      deleteDialog: false,
      selected: null,
      snackbar: { show: false, text: "" },
      rules: { required: (v) => !!v || "Obrigatório" },
      departureMenu: false,
      returnMenu: false,
      departureMenuEdit: false,
      returnMenuEdit: false,
    };
  },
  created() {
    this.fetchSchedules();
    this.fetchDrivers();
    this.fetchVehicles();
  },
  methods: {
    async fetchSchedules() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const schedules = await fetchSchedules(); // array direto
        this.schedules = schedules.map(s => ({
          ...s,
          departure_date: s.departure_date || "—",
          return_date: s.return_date || "—",
        }));
      } catch (e) {
        console.error("Erro ao buscar agendamentos:", e);
        this.errorMessage = "Falha ao carregar agendamentos.";
      } finally {
        this.loading = false;
      }
    },
    async fetchDrivers() {
      try {
        const { data } = await listDrivers();
        this.drivers = data;
      } catch (e) {
        console.error("Erro ao buscar motoristas:", e);
      }
    },
    async fetchVehicles() {
      try {
        const { data } = await listVehicles();
        this.vehicles = data;
      } catch (e) {
        console.error("Erro ao buscar veículos:", e);
      }
    },
    getDriverName(id) {
      const d = this.drivers.find((dr) => dr.id === id);
      return d ? d.name : "—";
    },
    getVehicleModel(id) {
      const v = this.vehicles.find((ve) => ve.id === id);
      return v ? v.model : "—";
    },
    async onCreate() {
      const ok = await this.$refs.createFormRef.validate();
      if (!ok.valid) return;
      try {
        const payload = {
          ...this.createForm,
          departure_date: this.createForm.departure_date
            ? new Date(this.createForm.departure_date).toISOString().split("T")[0]
            : null,
          return_date: this.createForm.return_date
            ? new Date(this.createForm.return_date).toISOString().split("T")[0]
            : null,
        };
        await createSchedule(payload);
        this.snackbar = { show: true, text: "Agendamento criado!" };
        this.createForm = {
          driver_id: null,
          vehicle_id: null,
          departure_date: null,
          return_date: null,
          origin: "",
          destination: "",
          km_initial: 0,
          km_final: 0,
          liters_fuel: 0,
          fuel_cost: 0,
          observations: "",
        };
        this.fetchSchedules();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao criar agendamento.";
      }
    },
    openEdit(item) {
      this.editForm = { ...item };
      this.editDialog = true;
    },
    async onUpdate() {
      const ok = await this.$refs.editFormRef.validate();
      if (!ok.valid) return;
      try {
        const payload = {
          ...this.editForm,
          departure_date: this.editForm.departure_date
            ? new Date(this.editForm.departure_date).toISOString().split("T")[0]
            : null,
          return_date: this.editForm.return_date
            ? new Date(this.editForm.return_date).toISOString().split("T")[0]
            : null,
        };
        await updateSchedule(this.editForm.id, payload);
        this.snackbar = { show: true, text: "Agendamento atualizado!" };
        this.editDialog = false;
        this.fetchSchedules();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao atualizar agendamento.";
      }
    },
    openDelete(item) {
      this.selected = item;
      this.deleteDialog = true;
    },
    async onDelete() {
      try {
        await deleteSchedule(this.selected.id);
        this.snackbar = { show: true, text: "Agendamento excluído!" };
        this.deleteDialog = false;
        this.fetchSchedules();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao excluir agendamento.";
      }
    },
  },
};
</script>

<style scoped>
/* ===== PAGE LAYOUT ===== */
.page-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* ===== PAGE HEADER ===== */
.page-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="schedule-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M15,5 L25,5 L25,35 L15,35 Z M20,10 L20,30 M10,15 L30,15 M10,25 L30,25" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23schedule-pattern)"/></svg>');
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon .v-avatar {
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.gradient-schedules {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.header-text {
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 8px 0 0 0;
  line-height: 1.3;
}

/* ===== CUSTOM ALERT ===== */
.custom-alert {
  border-radius: 16px;
  border: none !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

/* ===== CREATION CARD ===== */
.creation-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  margin-bottom: 32px;
}

.card-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.card-title {
  color: white;
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-content {
  padding: 32px;
}

/* ===== FORM STYLES ===== */
.form-row {
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field):hover {
  border-color: #4facfe;
  background: white;
}

.custom-input :deep(.v-field--focused) {
  border-color: #4facfe;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.custom-checkbox :deep(.v-selection-control) {
  margin-top: 20px;
}

.custom-checkbox :deep(.v-label) {
  font-weight: 500;
  color: #374151;
}

.form-actions {
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.action-btn {
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 12px 32px !important;
  transition: all 0.3s ease !important;
}

/* ===== FORM ACTION BUTTONS ===== */
.action-button {
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 12px 24px !important;
  min-width: 120px !important;
  margin-left: 12px !important;
}

.action-button.primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3) !important;
}

.action-button.primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4) !important;
}

.action-button.secondary {
  background: #f3f4f6 !important;
  color: #374151 !important;
  border: 2px solid #e5e7eb !important;
}

.action-button.secondary:hover {
  background: #e5e7eb !important;
}

.action-button.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
}

.action-button.danger:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4) !important;
}

.primary-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3) !important;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4) !important;
}

/* ===== TABLE CARD ===== */
.table-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.table-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
}

.table-search {
  width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  background: white;
  border: 2px solid #e5e7eb;
}

.search-input :deep(.v-field):hover {
  border-color: #4facfe;
}

.search-input :deep(.v-field--focused) {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.table-container {
  padding: 24px;
}

.custom-table :deep(.v-table__wrapper) {
  border-radius: 12px;
  overflow: hidden;
}

.custom-table :deep(.v-data-table-header) {
  background: #f8fafc;
}

.custom-table :deep(.v-data-table-header__content) {
  font-weight: 700 !important;
  color: #374151 !important;
}

.custom-table :deep(.v-data-table__tr:hover) {
  background: rgba(79, 172, 254, 0.04) !important;
}

/* ===== BADGES ===== */
.driver-badge,
.vehicle-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.driver-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.vehicle-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
}

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
}

.action-btn.edit {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #667eea !important;
}

.action-btn.edit:hover {
  background: rgba(102, 126, 234, 0.2) !important;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2) !important;
}

/* ===== NO DATA STATE ===== */
.no-data {
  padding: 60px 20px;
  text-align: center;
}

.no-data-icon {
  color: #d1d5db;
  margin-bottom: 16px;
}

.no-data-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.no-data-subtext {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* ===== CUSTOM DIALOGS ===== */
.custom-dialog :deep(.v-overlay__content) {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.dialog-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.dialog-header {
  padding: 32px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.dialog-title {
  font-size: 1.375rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.close-btn {
  color: #6b7280 !important;
}

.dialog-content {
  padding: 32px;
}

.dialog-actions {
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.cancel-btn {
  color: #6b7280 !important;
  text-transform: none !important;
  border-radius: 12px !important;
}

.save-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}

/* ===== DELETE DIALOG ===== */
.delete-dialog .dialog-header {
  flex-direction: column;
  text-align: center;
  gap: 16px;
}

.delete-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.delete-message {
  font-size: 1rem;
  color: #374151;
  margin: 0 0 8px 0;
  text-align: center;
}

.delete-warning {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

.delete-btn {
  background: #ef4444 !important;
  color: white !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}

/* ===== CUSTOM SNACKBAR ===== */
.custom-snackbar :deep(.v-snackbar__wrapper) {
  border-radius: 12px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .card-content {
    padding: 24px 16px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .table-search {
    width: 100%;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
}
</style>