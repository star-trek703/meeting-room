<template>
    <div class="container">
        <h2>Register</h2>

        <form @submit.prevent="register">
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="form.name" placeholder="Name" required />
            <input v-model="form.email" type="email" placeholder="Email" required />
            <input v-model="form.password" type="password" placeholder="Password" required />
            <input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" required />

            <button type="submit">Register</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../utils/axios'
import router from '../router'
import emitter from '../utils/bus'

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const error = ref('')

async function register() {
    if (form.value.password !== form.value.password_confirmation) {
        error.value = 'Confirm password does not match'
        return
    }

    try {
        const response = await axios.post('/register', form.value)
        localStorage.setItem('token', response.data.token)
        emitter.emit('loggedin', true)
        router.push({name: 'dashboard'})
    } catch (err) {
        error.value = err.response?.data?.message || 'Registration failed'
    }
}
</script>
