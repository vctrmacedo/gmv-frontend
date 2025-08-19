import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(router)   // adiciona o Vue Router
app.use(vuetify)  // adiciona o Vuetify
app.mount('#app') // monta a aplicação

