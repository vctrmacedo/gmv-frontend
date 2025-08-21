<template>
  <div class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <v-avatar size="60" class="gradient-vehicles elevation-4">
            <v-icon size="30" color="white">mdi-car</v-icon>
          </v-avatar>
        </div>
        <div class="header-text">
          <h1 class="page-title">Gerenciar Veículos</h1>
          <p class="page-subtitle">Controle completo da frota de veículos</p>
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
          <v-icon size="24" color="white">mdi-plus</v-icon>
        </div>
        <div class="card-title">Cadastrar Novo Veículo</div>
      </div>
      <div class="card-content">
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row class="form-row">
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Placa</label>
                <v-text-field
                  v-model="createForm.license_plate"
                  variant="outlined"
                  hide-details="auto"
                  :rules="[rules.required]"
                  class="custom-input"
                />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Modelo</label>
                <v-text-field
                  v-model="createForm.model"
                  variant="outlined"
                  hide-details="auto"
                  :rules="[rules.required]"
                  class="custom-input"
                />
              </div>
            </v-col>
            <v-col cols="12" md="2">
              <div class="form-group">
                <label class="form-label">Ano</label>
                <v-text-field
                  v-model="createForm.year"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                />
              </div>
            </v-col>
            <v-col cols="12" md="2">
              <div class="form-group">
                <label class="form-label">Quilometragem</label>
                <v-text-field
                  v-model="createForm.current_mileage"
                  type="number"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                />
              </div>
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <div class="form-group">
                <v-checkbox 
                  v-model="createForm.active" 
                  label="Veículo Ativo"
                  :true-value="true" 
                  :false-value="false"
                  class="custom-checkbox"
                />
              </div>
            </v-col>
          </v-row>
          <div class="form-actions">
            <v-btn type="submit" class="action-button primary">
              <v-icon class="mr-2">mdi-plus</v-icon>
              Cadastrar Veículo
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>

    <!-- SEÇÃO DA TABELA -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
          Lista de Veículos
        </div>
        <div class="table-search">
          <v-text-field
            v-model="search"
            placeholder="Buscar veículos..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="search-input"
          />
        </div>
      </div>

      <div class="table-container">
        <v-data-table 
          :headers="headers" 
          :items="vehicles" 
          :loading="loading" 
          :search="search"
          :items-per-page="10"
          :items-per-page-options="[5, 10, 25, 50, 100]"
          show-current-page
          class="custom-table"
        >
          <template #item.active="{ item }">
            <v-chip 
              :color="item.active ? 'success' : 'error'" 
              size="small"
              variant="tonal"
            >
              {{ item.active ? 'Ativo' : 'Inativo' }}
            </v-chip>
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
              <v-icon size="48" color="grey-lighten-1">mdi-car-off</v-icon>
              <div class="no-data-text">Nenhum veículo encontrado</div>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="520" persistent>
      <div class="custom-dialog">
        <div class="dialog-header">
          <v-icon class="mr-2" color="white">mdi-pencil</v-icon>
          <span class="dialog-title">Editar Veículo</span>
        </div>
        <div class="dialog-content">
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <div class="form-group">
              <label class="form-label">Placa</label>
              <v-text-field 
                v-model="editForm.license_plate" 
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
                class="custom-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Modelo</label>
              <v-text-field 
                v-model="editForm.model" 
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
                class="custom-input"
              />
            </div>
            <v-row>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Ano</label>
                  <v-text-field 
                    v-model="editForm.year" 
                    type="number"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                  />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Quilometragem</label>
                  <v-text-field 
                    v-model="editForm.current_mileage" 
                    type="number"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                  />
                </div>
              </v-col>
            </v-row>
            <div class="form-group">
              <v-checkbox 
                v-model="editForm.active" 
                label="Veículo Ativo"
                :true-value="true" 
                :false-value="false"
                class="custom-checkbox"
              />
            </div>
            <div class="dialog-actions">
              <v-btn @click="editDialog = false" class="action-button secondary">
                Cancelar
              </v-btn>
              <v-btn type="submit" class="action-button primary">
                <v-icon class="mr-2">mdi-content-save</v-icon>
                Salvar
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </v-dialog>

    <!-- DIALOG EXCLUIR -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <div class="custom-dialog">
        <div class="dialog-header danger">
          <v-icon class="mr-2" color="white">mdi-delete</v-icon>
          <span class="dialog-title">Excluir Veículo</span>
        </div>
        <div class="dialog-content">
          <div class="confirmation-message">
            <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
            <p>Tem certeza que deseja excluir o veículo <strong>{{ selected?.license_plate }}</strong>?</p>
            <p class="text-caption text-medium-emphasis">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="dialog-actions">
            <v-btn @click="deleteDialog = false" class="action-button secondary">
              Cancelar
            </v-btn>
            <v-btn @click="onDelete" class="action-button danger">
              <v-icon class="mr-2">mdi-delete</v-icon>
              Excluir
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { listVehicles, createVehicle, updateVehicle, deleteVehicle } from "../services/vehicles";

export default {
  name: "VehiclesView",
  data() {
    return {
      loading: false,
      vehicles: [],
      errorMessage: "",
      search: "", // Campo de busca
      headers: [
        { title: "ID", key: "id", sortable: true },
        { title: "Placa", key: "license_plate" },
        { title: "Modelo", key: "model" },
        { title: "Ano", key: "year" },
        { title: "Quilometragem", key: "current_mileage" },
        { title: "Ativo", key: "active" },
        { title: "Ações", key: "actions", sortable: false, align: "end" },
      ],

      createForm: { license_plate: "", model: "", year: null, current_mileage: 0, active: true },
      createFormRef: null,

      editDialog: false,
      editForm: { id: null, license_plate: "", model: "", year: null, current_mileage: 0, active: true },
      editFormRef: null,

      deleteDialog: false,
      selected: null,

      snackbar: { show: false, text: "" },

      rules: { required: (v) => !!v || "Obrigatório" },
    };
  },
  created() {
    this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const { data } = await listVehicles();
        this.vehicles = data.map(v => ({
          ...v,
          active: Boolean(v.active), // garante boolean vindo do backend
        }));
      } catch (e) {
        this.errorMessage = "Falha ao carregar veículos.";
      } finally {
        this.loading = false;
      }
    },

    async onCreate() {
      const ok = await this.$refs.createFormRef.validate();
      if (!ok.valid) return;

      try {
        const payload = {
          ...this.createForm,
          active: Boolean(this.createForm.active),
        };
        await createVehicle(payload);
        this.snackbar = { show: true, text: "Veículo criado!" };
        this.createForm = { license_plate: "", model: "", year: null, current_mileage: 0, active: true };
        this.fetchVehicles();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao criar veículo.";
      }
    },

    openEdit(item) {
      this.editForm = { ...item, active: Boolean(item.active) };
      this.editDialog = true;
    },

    async onUpdate() {
      const ok = await this.$refs.editFormRef.validate();
      if (!ok.valid) return;

      try {
        const payload = {
          ...this.editForm,
          active: Boolean(this.editForm.active),
        };
        await updateVehicle(this.editForm.id, payload);
        this.snackbar = { show: true, text: "Veículo atualizado!" };
        this.editDialog = false;
        this.fetchVehicles();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao atualizar veículo.";
      }
    },

    openDelete(item) {
      this.selected = item;
      this.deleteDialog = true;
    },

    async onDelete() {
      try {
        await deleteVehicle(this.selected.id);
        this.snackbar = { show: true, text: "Veículo excluído!" };
        this.deleteDialog = false;
        this.fetchVehicles();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao excluir veículo.";
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="car-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M10,25 L30,25 L35,15 L5,15 Z M8,25 L8,30 L12,30 L12,25 M28,25 L28,30 L32,30 L32,25" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23car-pattern)"/></svg>');
}

.header-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-icon {
  margin-right: 24px;
}

.gradient-vehicles {
  background: linear-gradient(45deg, #4facfe, #00f2fe) !important;
}

.page-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.page-subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  margin: 0;
}

/* ===== CUSTOM ALERT ===== */
.custom-alert {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(244, 67, 54, 0.1);
}

/* ===== CREATION CARD ===== */
.creation-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.card-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.card-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
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
}

/* ===== ACTION BUTTONS ===== */
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

/* ===== TABLE SECTION ===== */
.table-section {
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

.custom-table :deep(.v-data-table-header th) {
  background: #f8fafc !important;
  color: #374151 !important;
  font-weight: 700 !important;
  border-bottom: 2px solid #e5e7eb !important;
}

.custom-table :deep(.v-data-table-header__content) {
  font-weight: 700 !important;
  color: #374151 !important;
}

.custom-table :deep(.v-data-table__tr:hover) {
  background: #f8fafc !important;
}

/* ===== ACTION BUTTONS IN TABLE ===== */
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
  text-align: center;
  padding: 48px 24px;
}

.no-data-text {
  margin-top: 16px;
  font-size: 1rem;
  color: #6b7280;
}

/* ===== CUSTOM DIALOGS ===== */
.custom-dialog {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  max-width: 100%;
}

.dialog-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24px 32px;
  display: flex;
  align-items: center;
}

.dialog-header.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.dialog-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-content {
  padding: 32px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.confirmation-message {
  text-align: center;
  padding: 24px 0;
}

.confirmation-message p {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 8px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .table-search {
    width: 100%;
  }
  
  .card-content {
    padding: 24px;
  }
  
  .dialog-content {
    padding: 24px;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.creation-card,
.table-section {
  animation: slideIn 0.6s ease-out;
}

.creation-card {
  animation-delay: 0.1s;
}

.table-section {
  animation-delay: 0.2s;
}
</style>
