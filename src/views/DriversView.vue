<template>
  <div class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <v-avatar size="60" class="gradient-drivers elevation-4">
            <v-icon size="30" color="white">mdi-account-multiple</v-icon>
          </v-avatar>
        </div>
        <div class="header-text">
          <h1 class="page-title">Gerenciar Motoristas</h1>
          <p class="page-subtitle">Controle completo da equipe de motoristas</p>
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
        <div class="card-title">Cadastrar Novo Motorista</div>
      </div>
      <div class="card-content">
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row class="form-row">
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Nome</label>
                <v-text-field
                  v-model="createForm.name"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">CPF</label>
                <v-text-field
                  v-model="createForm.cpf"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Telefone</label>
                <v-text-field
                  v-model="createForm.phone"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Categoria CNH</label>
                <v-text-field
                  v-model="createForm.cnh_category"
                  variant="outlined"
                  hide-details="auto"
                  class="custom-input"
                  :rules="[rules.required]"
                />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="form-group">
                <label class="form-label">Validade CNH</label>
                <v-menu
                  v-model="cnhMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="createForm.cnh_validity"
                      variant="outlined"
                      readonly
                      class="custom-input"
                      :rules="[rules.required]"
                      v-bind="props"
                      append-inner-icon="mdi-calendar"
                    />
                  </template>
                  <v-date-picker
                    v-model="createForm.cnh_validity"
                    @update:model-value="cnhMenu = false"
                  />
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <div class="form-group">
                <v-checkbox 
                  v-model="createForm.active" 
                  label="Motorista Ativo"
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
              Cadastrar Motorista
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>

    <!-- LISTA DE MOTORISTAS -->
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">
          <v-icon class="mr-2">mdi-account-multiple</v-icon>
          Lista de Motoristas
        </h2>
        <div class="table-search">
          <v-text-field
            v-model="search"
            variant="outlined"
            placeholder="Buscar motoristas..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            class="search-input"
          />
        </div>
      </div>
      <div class="table-container">
        <v-data-table
          :headers="headers"
          :items="drivers"
          :search="search"
          :loading="loading"
          class="custom-table"
          no-data-text="Nenhum motorista encontrado"
          loading-text="Carregando motoristas..."
        >
          <template #item.active="{ item }">
            <div class="status-badge" :class="item.active ? 'status-active' : 'status-inactive'">
              <v-icon size="12">{{ item.active ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
              {{ item.active ? 'Ativo' : 'Inativo' }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="action-buttons">
              <v-btn size="small" variant="text" @click="onEdit(item)" class="action-btn edit">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn size="small" variant="text" @click="openDelete(item)" class="action-btn delete">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
          <template #no-data>
            <div class="no-data">
              <v-icon size="64" class="no-data-icon">mdi-account-off</v-icon>
              <div class="no-data-text">Nenhum motorista cadastrado</div>
              <div class="no-data-subtext">Comece cadastrando seu primeiro motorista</div>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- DIALOG DE EDIÇÃO -->
    <v-dialog v-model="editDialog" max-width="600px" class="custom-dialog">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <h3 class="dialog-title">Editar Motorista</h3>
          <v-btn icon class="close-btn" @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="dialog-content">
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-row>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Nome</label>
                  <v-text-field
                    v-model="editForm.name"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">CPF</label>
                  <v-text-field
                    v-model="editForm.cpf"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Telefone</label>
                  <v-text-field
                    v-model="editForm.phone"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Categoria CNH</label>
                  <v-text-field
                    v-model="editForm.cnh_category"
                    variant="outlined"
                    hide-details="auto"
                    class="custom-input"
                    :rules="[rules.required]"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Validade CNH</label>
                  <v-menu
                    v-model="cnhMenuEdit"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-model="editForm.cnh_validity"
                        variant="outlined"
                        readonly
                        class="custom-input"
                        :rules="[rules.required]"
                        v-bind="props"
                        append-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-date-picker
                      v-model="editForm.cnh_validity"
                      @update:model-value="cnhMenuEdit = false"
                    />
                  </v-menu>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <div class="form-group">
                  <v-checkbox 
                    v-model="editForm.active" 
                    label="Motorista Ativo"
                    :true-value="true" 
                    :false-value="false"
                    class="custom-checkbox"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="dialog-actions">
          <v-btn class="cancel-btn" @click="editDialog = false">Cancelar</v-btn>
          <v-btn class="save-btn" @click="onUpdate">Salvar</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- DIALOG DE EXCLUSÃO -->
    <v-dialog v-model="deleteDialog" max-width="400px" class="custom-dialog delete-dialog">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <div class="delete-icon">
            <v-icon size="32" color="#ef4444">mdi-delete-alert</v-icon>
          </div>
          <h3 class="delete-message">Excluir Motorista</h3>
          <p class="delete-warning">Esta ação não pode ser desfeita</p>
        </div>
        <div class="dialog-actions">
          <v-btn class="cancel-btn" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn class="delete-btn" @click="onDelete">Excluir</v-btn>
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
import { listDrivers, createDriver, updateDriver, deleteDriver } from "../services/drivers";

export default {
  name: "DriversView",
  data() {
    return {
      loading: false,
      drivers: [],
      errorMessage: "",
      search: "",
      headers: [
        { title: "ID", key: "id", sortable: true },
        { title: "Nome", key: "name" },
        { title: "CPF", key: "cpf" },
        { title: "Telefone", key: "phone" },
        { title: "CNH", key: "cnh_category" },
        { title: "Validade CNH", key: "cnh_validity" },
        { title: "Ativo", key: "active" },
        { title: "Ações", key: "actions", sortable: false, align: "end" },
      ],

      createForm: { name: "", cpf: "", phone: "", cnh_category: "", cnh_validity: null, active: true },
      createFormRef: null,

      editDialog: false,
      editForm: { id: null, name: "", cpf: "", phone: "", cnh_category: "", cnh_validity: null, active: true },
      editFormRef: null,

      deleteDialog: false,
      selected: null,

      snackbar: { show: false, text: "" },

      rules: { required: (v) => !!v || "Obrigatório" },

      cnhMenu: false,
      cnhMenuEdit: false,
    };
  },
  created() {
    this.fetchDrivers();
  },
  methods: {
    async fetchDrivers() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const { data } = await listDrivers();
        this.drivers = data.map(d => ({
          ...d,
          active: Boolean(d.active),
          cnh_validity: d.cnh_validity ? d.cnh_validity.split("T")[0] : null,
        }));
      } catch (e) {
        this.errorMessage = "Falha ao carregar motoristas.";
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
          cnh_validity: this.createForm.cnh_validity
         ? this.createForm.cnh_validity.toISOString().split("T")[0] 
         : null,
        };

        await createDriver(payload);
        this.snackbar = { show: true, text: "Motorista criado!" };
        this.createForm = { name: "", cpf: "", phone: "", cnh_category: "", cnh_validity: null, active: true };
        this.fetchDrivers();
      } catch (e) {
        console.error(e);
        this.errorMessage = e?.response?.data?.detail || "Erro ao criar motorista.";
      }
    },

    openEdit(item) {
      this.editForm = { ...item, active: Boolean(item.active) };
      this.editDialog = true;
    },

    onEdit(item) {
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
          cnh_validity: this.editForm.cnh_validity ? this.editForm.cnh_validity.split("T")[0] : null,
        };
        await updateDriver(this.editForm.id, payload);
        this.snackbar = { show: true, text: "Motorista atualizado!" };
        this.editDialog = false;
        this.fetchDrivers();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao atualizar motorista.";
      }
    },

    openDelete(item) {
      this.selected = item;
      this.deleteDialog = true;
    },

    async onDelete() {
      try {
        await deleteDriver(this.selected.id);
        this.snackbar = { show: true, text: "Motorista excluído!" };
        this.deleteDialog = false;
        this.fetchDrivers();
      } catch (e) {
        this.errorMessage = e?.response?.data?.detail || "Erro ao excluir motorista.";
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="driver-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,10 C25,10 25,15 20,15 C15,15 15,10 20,10 M12,25 L28,25 L28,30 L12,30 Z" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23driver-pattern)"/></svg>');
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

.gradient-drivers {
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  border-color: #f093fb;
  background: white;
}

.custom-input :deep(.v-field--focused) {
  border-color: #f093fb;
  background: white;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3) !important;
}

.action-button.primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4) !important;
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3) !important;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4) !important;
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
  border-color: #f093fb;
}

.search-input :deep(.v-field--focused) {
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
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
  background: rgba(240, 147, 251, 0.04) !important;
}

/* ===== STATUS BADGES ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
}

.status-inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
