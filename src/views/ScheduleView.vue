<template>
  <v-container class="py-6">
    <h2 class="mb-4">Agendamentos</h2>

    <!-- ALERT DE ERRO -->
    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable
      @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <!-- FORM DE CRIAÇÃO -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-subtitle-1">Criar novo agendamento</v-card-title>
      <v-card-text>
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row dense>
            <v-col cols="12" md="3">
              <v-select v-model="createForm.driver_id" :items="drivers" item-value="id" item-title="name"
                label="Motorista" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="createForm.vehicle_id" :items="vehicles" item-value="id" item-title="model"
                label="Veículo" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-menu v-model="departureMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ props }">
                  <v-text-field v-model="createForm.departure_date" label="Data de saída" readonly
                    v-bind="props" :rules="[rules.required]" />
                </template>
                <v-date-picker v-model="createForm.departure_date"
                  @update:model-value="departureMenu = false" :first-day-of-week="1" />
              </v-menu>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu v-model="returnMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ props }">
                  <v-text-field v-model="createForm.return_date" label="Data de retorno" readonly
                    v-bind="props" :rules="[rules.required]" />
                </template>
                <v-date-picker v-model="createForm.return_date"
                  @update:model-value="returnMenu = false" :first-day-of-week="1" />
              </v-menu>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.origin" label="Origem" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.destination" label="Destino" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.km_initial" label="KM Inicial" type="number" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.km_final" label="KM Final" type="number" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.liters_fuel" label="Litros abastecidos" type="number" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.fuel_cost" label="Custo do combustível" type="number" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="createForm.observations" label="Observações" />
            </v-col>
          </v-row>
          <v-btn type="submit" color="primary" class="mt-2">Criar agendamento</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- CAMPO DE BUSCA -->
    <v-text-field
      v-model="search"
      label="Buscar agendamentos..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      class="mb-4"
    />

    <!-- TABELA DE AGENDAMENTOS -->
    <v-data-table 
      :headers="headers" 
      :items="schedules" 
      :loading="loading" 
      :search="search"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 25, 50, 100]"
      show-current-page
      class="elevation-1"
    >
      <template #item.driver_id="{ item }">
        {{ getDriverName(item.driver_id) }}
      </template>
      <template #item.vehicle_id="{ item }">
        {{ getVehicleModel(item.vehicle_id) }}
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
        Nenhum agendamento encontrado.
      </template>
    </v-data-table>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>Editar agendamento</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-row dense>
              <v-col cols="12" md="3">
                <v-select v-model="editForm.driver_id" :items="drivers" item-value="id"
                  item-title="name" label="Motorista" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="3">
                <v-select v-model="editForm.vehicle_id" :items="vehicles" item-value="id"
                  item-title="model" label="Veículo" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="3">
                <v-menu v-model="departureMenuEdit" :close-on-content-click="false"
                  transition="scale-transition" offset-y min-width="auto">
                  <template #activator="{ props }">
                    <v-text-field v-model="editForm.departure_date" label="Data de saída" readonly
                      v-bind="props" :rules="[rules.required]" />
                  </template>
                  <v-date-picker v-model="editForm.departure_date"
                    @update:model-value="departureMenuEdit = false" :first-day-of-week="1" />
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-menu v-model="returnMenuEdit" :close-on-content-click="false"
                  transition="scale-transition" offset-y min-width="auto">
                  <template #activator="{ props }">
                    <v-text-field v-model="editForm.return_date" label="Data de retorno" readonly
                      v-bind="props" :rules="[rules.required]" />
                  </template>
                  <v-date-picker v-model="editForm.return_date"
                    @update:model-value="returnMenuEdit = false" :first-day-of-week="1" />
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="editForm.origin" label="Origem" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="editForm.destination" label="Destino" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="editForm.km_initial" label="KM Inicial" type="number" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="editForm.km_final" label="KM Final" type="number" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="editForm.liters_fuel" label="Litros abastecidos" type="number" />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="editForm.fuel_cost" label="Custo do combustível" type="number" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editForm.observations" label="Observações" />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" class="mt-2">Salvar</v-btn>
            <v-btn class="mt-2 ml-2" @click="editDialog = false">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir agendamento</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este agendamento?
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
