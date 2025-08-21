# 🚗 GMV - 👨‍💼 **Gestão de Motoristas** - Controle de CNH, validade e dados pessoais
- 📅 **Agendamentos** - Sistema completo de reservas com controle de combustível
- 📊 **Interface Responsiva** - Design adaptativo para desktop e mobile
- ⚡ **Tempo Real** - Validações instantâneas e feedback visual
- 🔒 **Segurança Avançada** - Autenticação via cookies seguros com proteção CSRF

## 🛠️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **Vuetify 3** - Biblioteca de componentes Material Design
- **Vue Router 4** - Roteamento SPA com guards de autenticação
- **Axios** - Cliente HTTP para APIs com interceptadores
- **Cookies Seguros** - Armazenamento seguro de tokens JWT
- **Vite** - Build tool e dev server ultrarrápido
- **ESLint** - Linting e padronização de código
- **SCSS** - Pré-processador CSStema de Gestão de Motoristas e Veículos

Sistema web completo para gerenciamento de frota de veículos, motoristas, usuários e agendamentos. Desenvolvido com Vue 3 e Vuetify 3, oferece uma interface moderna e responsiva para controle administrativo de frotas.

## ✨ Funcionalidades Principais

- 🔐 **Sistema de Autenticação** - Login seguro com JWT
- 👥 **Gestão de Usuários** - CRUD completo para administradores
- 🚙 **Gestão de Veículos** - Cadastro com placa, modelo, ano e quilometragem
- 👨‍💼 **Gestão de Motoristas** - Controle de CNH, validade e dados pessoais
- � **Agendamentos** - Sistema completo de reservas com controle de combustível
- 📊 **Interface Responsiva** - Design adaptativo para desktop e mobile
- ⚡ **Tempo Real** - Validações instantâneas e feedback visual

## �️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **Vuetify 3** - Biblioteca de componentes Material Design
- **Vue Router 4** - Roteamento SPA
- **Axios** - Cliente HTTP para APIs
- **Vite** - Build tool e dev server
- **ESLint** - Linting e padronização de código
- **SCSS** - Pré-processador CSS

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm**, **yarn**, **pnpm** ou **bun**
- **Backend GMV API** rodando em `http://localhost:8000`

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/vctrmacedo/gmv-frontend.git
cd gmv-frontend
```

### 2. Instale as dependências

Escolha seu gerenciador de pacotes preferido:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### 3. Execute o servidor de desenvolvimento

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 4. Build para produção

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm build

# bun
bun build
```

## 📱 Estrutura do Projeto

```
src/
├── views/           # Páginas principais da aplicação
│   ├── Login.vue           # Tela de autenticação com cookies
│   ├── HomeView.vue        # Dashboard principal
│   ├── UsersView.vue       # CRUD de usuários
│   ├── DriversView.vue     # CRUD de motoristas
│   ├── VehiclesView.vue    # CRUD de veículos
│   └── ScheduleView.vue    # CRUD de agendamentos
├── services/        # Camada de comunicação com APIs
│   ├── axios.js            # Configuração HTTP + interceptador
│   ├── users.js            # API de usuários
│   ├── drivers.js          # API de motoristas
│   ├── vehicles.js         # API de veículos
│   └── schedules.js        # API de agendamentos
├── utils/           # Utilitários e helpers
│   └── cookies.js          # Gerenciamento seguro de cookies
├── router/          # Configuração de rotas + guards
├── plugins/         # Configuração do Vuetify
├── styles/          # Estilos SCSS customizados
└── components/      # Componentes reutilizáveis (vazio)
```
```

## � Estrutura do Projeto

```
src/
├── views/           # Páginas principais da aplicação
│   ├── Login.vue           # Tela de autenticação
│   ├── HomeView.vue        # Dashboard principal
│   ├── UsersView.vue       # CRUD de usuários
│   ├── DriversView.vue     # CRUD de motoristas
│   ├── VehiclesView.vue    # CRUD de veículos
│   └── ScheduleView.vue    # CRUD de agendamentos
├── services/        # Camada de comunicação com APIs
│   ├── axios.js            # Configuração HTTP
│   ├── users.js            # API de usuários
│   ├── drivers.js          # API de motoristas
│   ├── vehicles.js         # API de veículos
│   └── schedules.js        # API de agendamentos
├── router/          # Configuração de rotas
├── plugins/         # Configuração do Vuetify
├── styles/          # Estilos SCSS customizados
└── components/      # Componentes reutilizáveis (vazio)
```

## 🔑 Funcionalidades Detalhadas

### Autenticação
- Login com email/username e senha
- Proteção de rotas com guards de autenticação
- Token JWT armazenado em cookies seguros
- Logout com remoção completa de cookies
- Interceptador automático para requisições HTTP

### Gestão de Usuários
- Listagem em tabela paginada
- Criação com validação de email
- Edição de dados existentes
- Exclusão com confirmação

### Gestão de Motoristas
- Cadastro completo com dados pessoais
- Controle de CNH (categoria e validade)
- Date picker para seleção de datas
- Status ativo/inativo

### Gestão de Veículos
- Registro de placa, modelo e ano
- Controle de quilometragem atual
- Status de disponibilidade
- Validações de formulário

### Sistema de Agendamentos
- Vinculação motorista + veículo
- Controle de datas (saída/retorno)
- Registro de combustível e custos
- Observações e notas

## 🌐 Configuração da API

O frontend está configurado para se comunicar com a API backend em:

```javascript
baseURL: "http://localhost:8000"
```

### Endpoints utilizados:
- `POST /auth/login` - Autenticação
- `GET/POST/PUT/DELETE /users/` - Usuários
- `GET/POST/PUT/DELETE /drivers` - Motoristas
- `GET/POST/PUT/DELETE /vehicles/` - Veículos
- `GET/POST/PUT/DELETE /schedules` - Agendamentos

## 🎨 Interface e UX

- **Design System:** Material Design 3 via Vuetify
- **Layout Responsivo:** Adaptável para desktop, tablet e mobile
- **Navegação:** App bar + drawer lateral
- **Feedback Visual:** Snackbars, alerts e loading states
- **Validações:** Em tempo real nos formulários
- **Confirmações:** Dialogs para ações destrutivas

## 🔒 Segurança e Autenticação

### Sistema de Cookies Seguros
A aplicação utiliza **cookies HTTPOnly** para armazenamento seguro do token JWT, substituindo o localStorage por maior segurança:

- **🍪 Armazenamento seguro:** Tokens armazenados em cookies com configurações de segurança
- **⏰ Expiração automática:** Controle granular de tempo de vida (7 dias padrão)
- **🛡️ Proteção CSRF:** Configuração `SameSite=Strict` para prevenir ataques
- **🔐 HTTPS obrigatório:** Cookies marcados como `secure` em produção
- **🔄 Interceptador automático:** Axios adiciona token automaticamente às requisições

### Configurações de Segurança

```javascript
// Configuração do cookie de autenticação
setCookie("auth_token", token, 7, {
  secure: process.env.NODE_ENV === 'production', // HTTPS em produção
  sameSite: 'Strict', // Proteção CSRF
  path: '/' // Disponível em toda aplicação
});
```

### Funcionalidades de Autenticação
- **Login persistente:** Sessão mantida entre recarregamentos
- **Logout seguro:** Remoção completa do cookie
- **Guard de rotas:** Proteção automática de páginas privadas
- **Redirecionamento inteligente:** Fluxo automático baseado na autenticação

### Utilitários de Cookie (`src/utils/cookies.js`)
- `setCookie()` - Define cookies com opções de segurança
- `getCookie()` - Recupera valores de cookies
- `removeCookie()` - Remove cookies específicos
- `cookieExists()` - Verifica existência de cookies

## � Scripts Disponíveis

```bash
# Servidor de desenvolvimento
npm run dev          # Inicia em http://localhost:3000

# Build de produção
npm run build        # Gera arquivos otimizados

# Preview da build
npm run preview      # Visualiza a build localmente

# Linting
npm run lint         # Executa ESLint com correções automáticas
```

## 🔄 Melhorias Recentes

### v2.0 - Migração para Cookies Seguros
- ✅ **Substituição do localStorage por cookies** para maior segurança
- ✅ **Implementação de cookies HTTPOnly** com proteção CSRF
- ✅ **Controle de expiração automática** de tokens (7 dias)
- ✅ **Configurações de segurança** para produção (HTTPS + SameSite)
- ✅ **Utilitários centralizados** para gerenciamento de cookies
- ✅ **Interceptador atualizado** para buscar tokens em cookies
- ✅ **Guards de rota melhorados** com validação por cookies

### Benefícios da Migração
- � **Maior segurança:** Cookies não acessíveis via JavaScript
- ⏰ **Expiração controlada:** Logout automático após período definido
- 🛡️ **Proteção CSRF:** Configuração SameSite adequada
- 🌐 **Compatibilidade SSR:** Funcionamento no lado servidor
- � **Melhor UX:** Persistência adequada da sessão

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**Victor Macedo** - [@vctrmacedo](https://github.com/vctrmacedo)

## 🆘 Suporte

Para reportar bugs ou solicitar novas funcionalidades, abra uma [issue](https://github.com/vctrmacedo/gmv-frontend/issues) no GitHub.

---

<p align="center">
  Desenvolvido com ❤️ usando Vue 3 + Vuetify 3
</p>
