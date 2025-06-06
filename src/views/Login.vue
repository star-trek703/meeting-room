<template>
    <div class="container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="form.email" type="email" placeholder="Email" required />
            <input v-model="form.password" type="password" placeholder="Password" required />

            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../utils/axios'
import router from '../router'
import emitter from '../utils/bus'

const form = ref({
  email: '',
  password: ''
})

const error = ref('')

async function login() {
    try {
        const response = await axios.post('/login', form.value)
        localStorage.setItem('token', response.data.token)
        emitter.emit('loggedin', true)
        router.push({name: 'dashboard'})
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed'
    }
}
</script>
