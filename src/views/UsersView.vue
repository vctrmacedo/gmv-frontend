<template>
  <v-container class="py-6">
    <h2 class="mb-4">Usuários</h2>

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
      <v-card-title class="text-subtitle-1">Criar novo usuário</v-card-title>
      <v-card-text>
        <v-form ref="createFormRef" @submit.prevent="onCreate">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="createForm.name"
                label="Nome"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="createForm.email"
                label="Email"
                :rules="[rules.required, rules.email]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="createForm.password"
                label="Senha"
                type="password"
                :rules="[rules.required, rules.min6]"
              />
            </v-col>
          </v-row>
          <v-btn type="submit" color="primary" class="mt-2">Criar usuário</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- CAMPO DE BUSCA -->
    <v-text-field
      v-model="search"
      label="Buscar usuários..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      class="mb-4"
    />

    <!-- TABELA -->
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      :search="search"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 25, 50, 100]"
      show-current-page
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" @click="openEdit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="openDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template #no-data>
        Nenhum usuário encontrado.
      </template>
    </v-data-table>

    <!-- DIALOG EDITAR -->
    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>Editar usuário</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent="onUpdate">
            <v-text-field v-model="editForm.name" label="Nome" :rules="[rules.required]" />
            <v-text-field v-model="editForm.email" label="Email" :rules="[rules.required, rules.email]" />
            <!-- TEMPORÁRIO: senha obrigatória enquanto o backend usa UserCreate no PUT -->
            <v-text-field v-model="editForm.password" label="Senha (obrigatória por enquanto)" type="password" :rules="[rules.required, rules.min6]" />
            <v-btn type="submit" color="primary" class="mt-2">Salvar</v-btn>
            <v-btn class="mt-2 ml-2" @click="editDialog = false">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir usuário</v-card-title>
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
import { listUsers, createUser, updateUser, deleteUser } from "../services/users";

export default {
  name: "UsersView",
  data() {
    return {
      loading: false,
      users: [],
      errorMessage: "",
      search: "", // Campo de busca
      headers: [
        { title: "ID", key: "id", sortable: true },
        { title: "Nome", key: "name" },
        { title: "Email", key: "email" },
        { title: "Ações", key: "actions", sortable: false, align: "end" },
      ],

      // criar
      createForm: { name: "", email: "", password: "" },
      createFormRef: null,

      // editar
      editDialog: false,
      editForm: { id: null, name: "", email: "", password: "" },
      editFormRef: null,

      // excluir
      deleteDialog: false,
      selected: null,

      snackbar: { show: false, text: "" },

      rules: {
        required: (v) => !!v || "Obrigatório",
        email: (v) => /.+@.+\..+/.test(v) || "Email inválido",
        min6: (v) => (v && v.length >= 6) || "Mínimo de 6 caracteres",
      },
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const { data } = await listUsers();
        this.users = data;
      } catch (e) {
        this.errorMessage = "Falha ao carregar usuários.";
      } finally {
        this.loading = false;
      }
    },

    async onCreate() {
      const ok = await this.$refs.createFormRef.validate();
      if (!ok.valid) return;

      try {
        await createUser({ ...this.createForm });
        this.snackbar = { show: true, text: "Usuário criado!" };
        this.createForm = { name: "", email: "", password: "" };
        this.fetchUsers();
      } catch (e) {
        this.errorMessage =
          e?.response?.data?.detail || "Erro ao criar usuário.";
      }
    },

    openEdit(item) {
      this.editForm = { id: item.id, name: item.name, email: item.email, password: "" };
      this.editDialog = true;
    },

    async onUpdate() {
      const ok = await this.$refs.editFormRef.validate();
      if (!ok.valid) return;

      try {
        await updateUser(this.editForm.id, {
          name: this.editForm.name,
          email: this.editForm.email,
          password: this.editForm.password, // temporariamente obrigatório
        });
        this.snackbar = { show: true, text: "Usuário atualizado!" };
        this.editDialog = false;
        this.fetchUsers();
      } catch (e) {
        this.errorMessage =
          e?.response?.data?.detail || "Erro ao atualizar usuário.";
      }
    },

    openDelete(item) {
      this.selected = item;
      this.deleteDialog = true;
    },

    async onDelete() {
      try {
        await deleteUser(this.selected.id);
        this.snackbar = { show: true, text: "Usuário excluído!" };
        this.deleteDialog = false;
        this.fetchUsers();
      } catch (e) {
        this.errorMessage =
          e?.response?.data?.detail || "Erro ao excluir usuário.";
      }
    },
  },
};
</script>
