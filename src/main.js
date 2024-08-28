import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {router} from './common/router'
import App from './App.vue'
import naive from 'naive-ui'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'

const app = createApp(App)

app.provide("axios",axios)
app.use(naive)
app.use(createPinia())
app.use(router)
app.mount('#app')
