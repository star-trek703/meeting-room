import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/app.css'

axios.defaults.baseURL = 'http://localhost:8000/api'

const app = createApp(App)

app.use(router)
app.mount('#app')
