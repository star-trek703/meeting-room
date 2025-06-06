<template>
    <header class="app-header">
        <div class="logo">
            <router-link to="/">Meeting room</router-link>
        </div>

        <nav v-if="isLoggedIn">
            <router-link :to="{name: 'dashboard'}">My meetings</router-link>
            <router-link :to="{name: 'book'}">Book a meeting</router-link>
            <router-link :to="{name: 'plans'}">Plans</router-link>

            <button @click="logout">Logout</button>
        </nav>
        <nav v-else>
            <router-link :to="{name: 'register'}">Register</router-link>
            <router-link :to="{name: 'login'}">Login</router-link>
        </nav>
    </header>
</template>

<script setup>
import axios from '../utils/axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import emitter from '../utils/bus'

const router = useRouter()

const isLoggedIn = ref(null)
// const isLoggedIn = computed(() => !!localStorage.getItem('token'))

async function logout() {
    await axios.post('/logout')
    localStorage.removeItem('token')
    isLoggedIn.value = false
    router.push({name: 'login'})
}

onMounted(() => {
    emitter.on('loggedin', function () {
        isLoggedIn.value = true
    })

    isLoggedIn.value = !!localStorage.getItem('token')
})
</script>

<style scoped>
button {
    background: #c00;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
}
</style>
