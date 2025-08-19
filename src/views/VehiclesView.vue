<template>
  <v-container class="py-6">
    <h2 class="mb-4">Veículos</h2>

    <!-- ALERT DE ERRO -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <!-- FORM DE CRIAÇÃO -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-subtitle-1">Criar novo veículo</v-card-title>
      <v-card-text>
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.license_plate" label="Placa" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.model" label="Modelo" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.year" label="Ano" type="number" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.current_mileage" label="Quilometragem atual" type="number" />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
              <v-checkbox 
                v-model="createForm.active" 
                label="Ativo" 
                :true-value="true" 
                :false-value="false"
              />
            </v-col>
          </v-row>
          <v-btn type="submit" color="primary" class="mt-2">Criar veículo</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- TABELA DE VEÍCULOS -->
    <v-data-table :headers="headers" :items="vehicles" :loading="loading" class="elevation-1">
      <template #item.active="{ item }">
        <span :class="item.active ? 'text-success' : 'text-error'">
          {{ item.active ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #no-data>
        Nenhum veículo encontrado.
      </template>
    </v-data-table>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>Editar veículo</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-text-field v-model="editForm.license_plate" label="Placa" :rules="[rules.required]" />
            <v-text-field v-model="editForm.model" label="Modelo" :rules="[rules.required]" />
            <v-text-field v-model="editForm.year" label="Ano" type="number" />
            <v-text-field v-model="editForm.current_mileage" label="Quilometragem atual" type="number" />
            <v-checkbox 
              v-model="editForm.active" 
              label="Ativo" 
              :true-value="true" 
              :false-value="false"
            />
            <v-btn type="submit" color="primary" class="mt-2">Salvar</v-btn>
            <v-btn class="mt-2 ml-2" @click="editDialog = false">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir veículo</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir <strong>{{ selected?.license_plate }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="onDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
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
