<template>
  <v-container class="py-6">
    <h2 class="mb-4">Motoristas</h2>

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
      <v-card-title class="text-subtitle-1">Criar novo motorista</v-card-title>
      <v-card-text>
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.name" label="Nome" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.cpf" label="CPF" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="createForm.phone" label="Telefone" />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="createForm.cnh_category" label="Categoria CNH" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="2">
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
                    label="Validade CNH"
                    readonly
                    v-bind="props"
                    :rules="[rules.required]"
                  />
                </template>
                <v-date-picker
                  v-model="createForm.cnh_validity"
                  @update:model-value="cnhMenu = false"
                  :first-day-of-week="1"
                />
              </v-menu>
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
          <v-btn type="submit" color="primary" class="mt-2">Criar motorista</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- TABELA DE MOTORISTAS -->
    <v-data-table :headers="headers" :items="drivers" :loading="loading" class="elevation-1">
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
        Nenhum motorista encontrado.
      </template>
    </v-data-table>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>Editar motorista</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-text-field v-model="editForm.name" label="Nome" :rules="[rules.required]" />
            <v-text-field v-model="editForm.cpf" label="CPF" :rules="[rules.required]" />
            <v-text-field v-model="editForm.phone" label="Telefone" />
            <v-text-field v-model="editForm.cnh_category" label="Categoria CNH" :rules="[rules.required]" />
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
                  label="Validade CNH"
                  readonly
                  v-bind="props"
                  :rules="[rules.required]"
                />
              </template>
              <v-date-picker
                v-model="editForm.cnh_validity"
                @update:model-value="cnhMenuEdit = false"
                :first-day-of-week="1"
              />
            </v-menu>
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
        <v-card-title>Excluir motorista</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir <strong>{{ selected?.name }}</strong>?
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
import { listDrivers, createDriver, updateDriver, deleteDriver } from "../services/drivers";

export default {
  name: "DriversView",
  data() {
    return {
      loading: false,
      drivers: [],
      errorMessage: "",
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
      // garante que só enviamos a data exata sem horário
      cnh_validity: this.createForm.cnh_validity
     ? this.createForm.cnh_validity.toISOString().split("T")[0] 
     : null,
    };

    console.log("Payload enviado:", payload); // pra debugar

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
