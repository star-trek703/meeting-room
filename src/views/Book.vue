<template>
    <div class="container">
        <h2>Book a meeting</h2>
        <form @submit.prevent="bookMeeting">
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="meeting.meeting_name" placeholder="Meeting Name" required />

            <input
                v-model="meeting.start_time"
                type="datetime-local"
                :min="minDateTime"
                required
            />

            <select v-model="meeting.duration" required>
                <option disabled value="">Select Duration</option>
                <option value="30">30 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
            </select>

            <input
                v-model.number="meeting.members"
                type="number"
                min="1"
                :max="15"
                placeholder="Number of Members (max 15)"
                required
            />

            <button type="button" @click="getRooms">Check Available Rooms</button>

            <select v-if="rooms.length" v-model="meeting.meeting_room_id" required>
                <option disabled value="">Select Meeting Room</option>
                <option v-for="room in rooms" :key="room.id" :value="room.id">
                    {{ room.name }} (Capacity: {{ room.capacity }})
                </option>
            </select>

            <button type="submit">Book</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../utils/axios'
import router from '../router'

const meeting = ref({
    name: '',
    start_time: '',
    duration: '',
    members: null,
    room: ''
})

const rooms = ref([])
const error = ref('')

const minDateTime = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
})

async function getRooms() {
    if (!meeting.value.start_time || !meeting.value.duration || !meeting.value.members) {
        error.value = 'Please fill all fields before checking rooms'
        return
    }

    try {
        const { data } = await axios.get('/rooms', {
            params: {
                start_time: meeting.value.start_time,
                duration: meeting.value.duration,
                members: meeting.value.members
            }
        })
        rooms.value = data.rooms
        error.value = rooms.value.length ? '' : 'No rooms available'
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load rooms'
    }
}

async function bookMeeting() {
    try {
        await axios.post('/bookings', meeting.value)
        router.push({name: 'dashboard'})
    } catch (err) {
        console.log(err)        
        error.value = err.response?.data?.message || 'Booking failed'
    }
}

onMounted(() => {
    getRooms()
})
</script>
